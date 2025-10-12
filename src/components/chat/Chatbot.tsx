import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2, User, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { detectIntent, getResponse, defaultResponse, ChatResponse } from '@/utils/chatbotResponses';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const STORAGE_KEY = 'subhakary_chat_history';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const inputText = messageText || input;
    if (!inputText.trim()) return;

    const newMessage: Message = { role: 'user', content: inputText };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    
    // Try local pattern matching first
    const intent = detectIntent(inputText);
    const localResponse = intent ? getResponse(intent) : null;

    if (localResponse) {
      // Use local response - faster!
      setShowTyping(true);
      
      setTimeout(() => {
        setShowTyping(false);
        const assistantMessage: Message = {
          role: 'assistant',
          content: localResponse.message
        };
        setMessages(prev => [...prev, assistantMessage]);
      }, 800);
    } else {
      // Fallback to AI for complex queries
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
          description: error instanceof Error ? error.message : "Failed to get response. Please try again.",
          variant: "destructive"
        });
        
        // Fallback to default response
        const assistantMessage: Message = {
          role: 'assistant',
          content: defaultResponse.message
        };
        setMessages(prev => [...prev, assistantMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleQuickAction = (action: string) => {
    handleSend(action);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-ceremonial-gold hover:bg-ceremonial-gold/90 shadow-neuro transition-all duration-300 hover:scale-105 animate-float"
          aria-label="Open chat"
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </Button>
      ) : (
        <div className="w-[380px] md:w-[400px] rounded-2xl overflow-hidden shadow-xl bg-white animate-scale-up border border-gray-200">
          {/* Header */}
          <div className="px-4 py-4 bg-gradient-to-r from-ceremonial-gold to-ceremonial-maroon text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">Subhakary Assistant</h3>
                <p className="text-xs text-white/80">Always here to help</p>
              </div>
            </div>
            <div className="flex gap-1">
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  className="hover:bg-white/10 text-white rounded-full h-8 w-8"
                  title="Clear chat"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 text-white rounded-full h-8 w-8"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Messages Area */}
          <ScrollArea className="h-[400px] bg-gradient-to-b from-ceremonial-cream/30 to-white">
            <div className="p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8 px-4 animate-slide-up-fade">
                  <div className="bg-gradient-to-br from-ceremonial-gold/10 to-ceremonial-teal/10 rounded-2xl p-6 border border-ceremonial-gold/20">
                    <div className="flex justify-center mb-4">
                      <div className="bg-ceremonial-gold/20 p-3 rounded-full">
                        <Bot className="w-8 h-8 text-ceremonial-gold" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      🙏 Namaste! Welcome to Subhakary
                    </p>
                    <p className="text-xs text-gray-600 mb-4">
                      I can help you with our ceremonial services. Try asking about:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/60 rounded-lg p-2">🕉️ Poojari</div>
                      <div className="bg-white/60 rounded-lg p-2">💅 Mehendi</div>
                      <div className="bg-white/60 rounded-lg p-2">📸 Photography</div>
                      <div className="bg-white/60 rounded-lg p-2">🍽️ Catering</div>
                    </div>
                  </div>
                </div>
              )}
              
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 items-start animate-slide-up-fade ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-ceremonial-gold to-ceremonial-maroon' 
                      : 'bg-gradient-to-br from-ceremonial-teal/20 to-ceremonial-gold/20 border border-ceremonial-gold/30'
                  }`}>
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-ceremonial-gold" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-ceremonial-gold to-ceremonial-maroon text-white rounded-tr-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {showTyping && (
                <div className="flex gap-2 items-start animate-slide-up-fade">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-ceremonial-teal/20 to-ceremonial-gold/20 border border-ceremonial-gold/30 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-ceremonial-gold" />
                  </div>
                  <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-ceremonial-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-ceremonial-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-ceremonial-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {isLoading && (
                <div className="flex gap-2 items-start animate-slide-up-fade">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-ceremonial-teal/20 to-ceremonial-gold/20 border border-ceremonial-gold/30 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-ceremonial-gold" />
                  </div>
                  <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-ceremonial-gold" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Quick Actions */}
          {messages.length === 0 && (
            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickAction('Tell me about Poojari services')}
                  className="text-xs bg-white hover:bg-ceremonial-cream border border-gray-200 rounded-lg px-3 py-2 transition-all hover:border-ceremonial-gold hover:shadow-sm"
                  disabled={isLoading || showTyping}
                >
                  🕉️ Poojari
                </button>
                <button
                  onClick={() => handleQuickAction('Photography services')}
                  className="text-xs bg-white hover:bg-ceremonial-cream border border-gray-200 rounded-lg px-3 py-2 transition-all hover:border-ceremonial-gold hover:shadow-sm"
                  disabled={isLoading || showTyping}
                >
                  📸 Photography
                </button>
                <button
                  onClick={() => handleQuickAction('How to book?')}
                  className="text-xs bg-white hover:bg-ceremonial-cream border border-gray-200 rounded-lg px-3 py-2 transition-all hover:border-ceremonial-gold hover:shadow-sm"
                  disabled={isLoading || showTyping}
                >
                  📅 Booking
                </button>
                <button
                  onClick={() => handleQuickAction('Service areas')}
                  className="text-xs bg-white hover:bg-ceremonial-cream border border-gray-200 rounded-lg px-3 py-2 transition-all hover:border-ceremonial-gold hover:shadow-sm"
                  disabled={isLoading || showTyping}
                >
                  📍 Locations
                </button>
              </div>
            </div>
          )}
          
          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && !showTyping && handleSend()}
                placeholder="Ask about our services..."
                className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ceremonial-gold focus:border-transparent bg-white text-sm transition-all"
                disabled={isLoading || showTyping}
              />
              <Button
                onClick={() => handleSend()}
                disabled={isLoading || showTyping || !input.trim()}
                className="rounded-full bg-gradient-to-r from-ceremonial-gold to-ceremonial-maroon hover:from-ceremonial-gold/90 hover:to-ceremonial-maroon/90 text-white shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-center text-gray-400 mt-2">Powered by Subhakary</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;