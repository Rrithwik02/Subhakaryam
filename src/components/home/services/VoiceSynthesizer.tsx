import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const useVoiceSynthesizer = () => {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const speakDescription = async (text: string) => {
    try {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }

      if (isLoading) return;

      setIsLoading(true);

      const { data, error } = await supabase.functions.invoke('voice-synthesis', {
        body: { 
          text,
          language: 'en-US'
        }
      });

      if (error) {
        
        if (error.message?.includes('Rate limit exceeded')) {
          toast({
            title: "Please wait",
            description: "Too many requests. Please wait a moment before trying again.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to generate speech. Please try again later.",
            variant: "destructive"
          });
        }
        return;
      }

      if (data?.audio) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        setCurrentAudio(audio);
        await audio.play();
      }
    } catch (error) {
      
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopSpeaking = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
  };

  return {
    speakDescription,
    stopSpeaking,
    isLoading
  };
};