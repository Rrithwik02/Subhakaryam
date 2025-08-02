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
  const [isLoading, setIsLoading] = useState(true);
  const { session, isLoading: sessionLoading } = useSessionContext();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Wait for session to load before initializing
  useEffect(() => {
    const initializeChat = async () => {
      // Wait for session to load
      if (sessionLoading) {
        return;
      }

      if (!session?.user?.id || !receiverId) {
        setIsInitialized(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, user_type')
          .in('id', [session.user.id, receiverId]);

        if (error) {
          console.error('ChatInterface: Profile query error:', error);
          throw error;
        }
        
        if (!data || data.length < 1) {
          console.error('ChatInterface: No profiles found');
          setIsInitialized(false);
          setIsLoading(false);
          return;
        }

        setIsInitialized(true);
        setIsLoading(false);
      } catch (error) {
        console.error('ChatInterface: Profile verification failed:', error);
        setIsInitialized(false);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Unable to initialize chat - please try again later",
        });
      }
    };

    initializeChat();
  }, [sessionLoading, session?.user?.id, receiverId, bookingId, toast]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!isInitialized) {
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("booking_id", bookingId)
          .order("created_at", { ascending: true });

        if (error) {
          console.error('ChatInterface: Error fetching messages:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load chat messages",
          });
          return;
        }

        setMessages(data || []);
      } catch (error) {
        console.error('ChatInterface: Unexpected error fetching messages:', error);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat-messages-${bookingId}`)
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
      const messageData = {
        booking_id: bookingId,
        sender_id: session.user.id,
        receiver_id: receiverId,
        message: newMessage.trim(),
      };

      const { error: insertError } = await supabase.from("chat_messages").insert(messageData);

      if (insertError) {
        console.error('ChatInterface: Error inserting message:', insertError);
        throw insertError;
      }

      setNewMessage("");
    } catch (error) {
      console.error('ChatInterface: Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message",
      });
    }
  };

  if (isLoading || sessionLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            Loading chat...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isInitialized) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            Unable to initialize chat. Please try refreshing the page.
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
