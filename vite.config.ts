
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/' : '/',
  server: {
    host: "::",
    port: 8080,
    historyApiFallback: true,
  },
  build: {
    rollupOptions: {
      output: {
      manualChunks: (id) => {
        if (id.includes('node_modules')) {
          // Group React and all React-dependent UI libraries together
          if (id.includes('react') || 
              id.includes('react-dom') ||
              id.includes('@radix-ui') ||
              id.includes('vaul') ||
              id.includes('sonner') ||
              id.includes('embla-carousel') ||
              id.includes('react-resizable-panels') ||
              id.includes('react-big-calendar') ||
              id.includes('react-day-picker') ||
              id.includes('lucide-react')) {
            return 'vendor-react';
          }
          // Keep Supabase separate (large independent chunk)
          if (id.includes('@supabase')) {
            return 'vendor-supabase';
          }
          // Keep TanStack Query separate (large independent chunk)
          if (id.includes('@tanstack')) {
            return 'vendor-query';
          }
          // Everything else together
          return 'vendor-other';
        }
      },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
