import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: { messages: [...messages, newMessage] }
      });

      if (error) {
        
        throw new Error('Failed to connect to chat service');
      }

      if (!data?.choices?.[0]?.message?.content) {
        
        throw new Error('Invalid response from chat service');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      
      toast({
        title: "Error",
        description: error.message || "Failed to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-ceremonial-gold hover:bg-ceremonial-gold/90 shadow-neuro transition-all duration-300 hover:scale-105"
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </Button>
      ) : (
        <div className="w-[350px] h-[500px] rounded-2xl overflow-hidden shadow-neuro bg-ceremonial-cream animate-scale-up">
          <div className="px-6 py-4 bg-ceremonial-gold text-white flex justify-between items-center border-b border-ceremonial-gold/20">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6" />
              <h3 className="font-display text-lg">Subhakaryam Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100%-8rem)] p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  <p className="text-sm">Welcome! How can I assist you with ceremonial services today?</p>
                  <p className="text-xs mt-2">Try asking about:</p>
                  <ul className="text-xs mt-1 space-y-1">
                    <li>• Poojari services</li>
                    <li>• Booking process</li>
                    <li>• Service locations</li>
                    <li>• Pricing information</li>
                  </ul>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-ceremonial-gold text-white ml-4'
                        : 'bg-white shadow-neuro-inset mr-4'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-neuro-inset max-w-[80%] p-3 rounded-2xl mr-4">
                    <Loader2 className="w-5 h-5 animate-spin text-ceremonial-gold" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ceremonial-gold/50 bg-white"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white shadow-neuro hover:shadow-neuro-inset transition-all duration-300"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;