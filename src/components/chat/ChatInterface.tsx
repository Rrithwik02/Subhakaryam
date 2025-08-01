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
      console.log('ChatInterface: Starting initialization', { 
        sessionLoading, 
        sessionUserId: session?.user?.id, 
        receiverId, 
        bookingId 
      });

      // Wait for session to load
      if (sessionLoading) {
        console.log('ChatInterface: Session still loading...');
        return;
      }

      if (!session?.user?.id || !receiverId) {
        console.log('ChatInterface: Missing required data', { 
          userId: session?.user?.id, 
          receiverId 
        });
        setIsInitialized(false);
        setIsLoading(false);
        return;
      }

      try {
        console.log('ChatInterface: Verifying profiles...');
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, user_type')
          .in('id', [session.user.id, receiverId]);

        if (error) {
          console.error('ChatInterface: Profile query error:', error);
          throw error;
        }
        
        console.log('ChatInterface: Profile verification result:', { 
          foundProfiles: data?.length, 
          profiles: data 
        });
        
        if (!data || data.length < 1) {
          console.error('ChatInterface: No profiles found');
          setIsInitialized(false);
          setIsLoading(false);
          return;
        }

        // Initialize chat even if only one profile found (more lenient)
        console.log('ChatInterface: Profiles verified, initializing chat');
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
        console.log('ChatInterface: Not initialized, skipping message fetch');
        return;
      }

      console.log('ChatInterface: Fetching messages for booking:', bookingId);
      
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

        console.log('ChatInterface: Messages fetched successfully:', data?.length || 0);
        setMessages(data || []);
      } catch (error) {
        console.error('ChatInterface: Unexpected error fetching messages:', error);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    console.log('ChatInterface: Setting up realtime subscription for booking:', bookingId);
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
          console.log('ChatInterface: New message received via realtime:', payload.new);
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe((status) => {
        console.log('ChatInterface: Realtime subscription status:', status);
      });

    return () => {
      console.log('ChatInterface: Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [bookingId, isInitialized, toast]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !session?.user || !isInitialized) return;

    console.log('ChatInterface: Sending message...', { 
      bookingId, 
      receiverId, 
      senderId: session.user.id,
      messageContent: newMessage.trim() 
    });

    try {
      const messageData = {
        booking_id: bookingId,
        sender_id: session.user.id,
        receiver_id: receiverId,
        message: newMessage.trim(),
      };

      console.log('ChatInterface: Inserting message with data:', messageData);

      const { error: insertError } = await supabase.from("chat_messages").insert(messageData);

      if (insertError) {
        console.error('ChatInterface: Error inserting message:', insertError);
        throw insertError;
      }

      console.log('ChatInterface: Message sent successfully');
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
