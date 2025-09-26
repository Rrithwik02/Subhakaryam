import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { supabase } from "./integrations/supabase/client";
import BackButton from "./components/layout/BackButton";
import Navbar from "./components/layout/Navbar";
import ErrorBoundary from "./components/error/ErrorBoundary";
import AppRoutes from "./components/layout/AppRoutes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (error?.message?.includes('auth') || error?.message?.includes('401')) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <SessionContextProvider supabaseClient={supabase}>
            <AppContent />
          </SessionContextProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

const AppContent: React.FC = () => {
  useEffect(() => {
    // Handle immediate session state changes for better user experience
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in:', session.user);
        
        // Check user type and redirect accordingly
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("user_type")
            .eq("id", session.user.id)
            .single();

          if (profile?.user_type === 'admin') {
            window.location.href = '/admin';
          } else {
            const { data: provider } = await supabase
              .from("service_providers")
              .select("id")
              .eq("profile_id", session.user.id)
              .maybeSingle();

            if (provider) {
              window.location.href = '/dashboard';
            } else {
              window.location.href = '/';
            }
          }
        } catch (error) {
          console.error('Error checking user type:', error);
          window.location.href = '/';
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <BackButton />
        <main className="flex-1 pt-20">
          <AppRoutes />
        </main>
        
      </div>
      <Toaster />
    </Router>
  );
};

export default App;