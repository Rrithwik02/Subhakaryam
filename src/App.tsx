
import React from "react";
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
