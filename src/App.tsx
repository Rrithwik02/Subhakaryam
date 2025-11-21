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
import { initErrorMonitoring, setUserContext, clearUserContext, addBreadcrumb } from "./services/errorMonitoring";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (error instanceof Error && error.message.includes('auth')) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      networkMode: 'online',
    },
    mutations: {
      retry: false,
      networkMode: 'online',
    },
  },
});

// Global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled promise rejection:', event.reason);
    event.preventDefault(); // Prevent white page
  });
}

// Initialize error monitoring on app load
initErrorMonitoring();

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
        
        // Set user context for error monitoring
        setUserContext({
          id: session.user.id,
          email: session.user.email,
        });
        
        addBreadcrumb('User signed in', 'auth', 'info', {
          userId: session.user.id,
        });
        
        // Check user type and redirect accordingly
        try {
          const { data: isAdmin } = await supabase.rpc(
            'is_user_admin',
            { user_id: session.user.id }
          );

          if (isAdmin) {
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
      } else if (event === 'SIGNED_OUT') {
        // Clear user context on logout
        clearUserContext();
        addBreadcrumb('User signed out', 'auth', 'info');
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