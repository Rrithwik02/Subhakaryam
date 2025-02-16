
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Send } from "lucide-react";

interface ChatInterfaceProps {
  bookingId: string;
  receiverId: string;
  isDisabled?: boolean;
}

const ChatInterface = ({ bookingId, receiverId, isDisabled }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const { session } = useSessionContext();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  // First, verify that both sender and receiver exist in profiles table
  useEffect(() => {
    const verifyProfiles = async () => {
      if (!session?.user?.id || !receiverId) {
        setIsInitialized(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .in('id', [session.user.id, receiverId]);

        if (error) throw error;
        
        if (!data || data.length !== 2) {
          console.error('Profile verification failed: Not all profiles found');
          setIsInitialized(false);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Unable to initialize chat - invalid user profiles",
          });
          return;
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Profile verification failed:', error);
        setIsInitialized(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Unable to initialize chat - please try again later",
        });
      }
    };

    verifyProfiles();
  }, [session?.user?.id, receiverId, toast]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!isInitialized) return;

      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load chat messages",
        });
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel("chat-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId, isInitialized, toast]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !session?.user || !isInitialized) return;

    try {
      // Verify sender profile exists
      const { data: senderProfile, error: senderError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();

      if (senderError || !senderProfile) {
        console.error('Sender profile not found:', senderError);
        throw new Error('Sender profile not found');
      }

      // Verify receiver profile exists
      const { data: receiverProfile, error: receiverError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', receiverId)
        .maybeSingle();

      if (receiverError || !receiverProfile) {
        console.error('Receiver profile not found:', receiverError);
        throw new Error('Receiver profile not found');
      }

      const { error: insertError } = await supabase.from("chat_messages").insert({
        booking_id: bookingId,
        sender_id: session.user.id,
        receiver_id: receiverId,
        message: newMessage.trim(),
      });

      if (insertError) throw insertError;

      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message",
      });
    }
  };

  if (!isInitialized) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-4">
            Unable to initialize chat. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender_id === session?.user?.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender_id === session?.user?.id
                      ? "bg-ceremonial-gold text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
        <div className="mt-4 flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isDisabled && sendMessage()}
            placeholder="Type your message..."
            disabled={isDisabled}
          />
          <Button
            onClick={sendMessage}
            disabled={isDisabled}
            className="bg-ceremonial-gold hover:bg-ceremonial-gold/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
