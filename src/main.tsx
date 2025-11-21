import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/i18n'

// Hide loading screen when React mounts
const hideLoadingScreen = () => {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => loadingScreen.remove(), 300);
  }
};

// Global error handler for module loading errors
const handleModuleError = (error: Error) => {
  console.error('Module loading error:', error);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);">
        <div style="background: white; padding: 40px; border-radius: 12px; max-width: 500px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
          <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
          <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 12px; color: #1a1a1a;">Unable to Load Application</h1>
          <p style="color: #666; margin-bottom: 24px; line-height: 1.6;">
            We encountered an error while loading the application. This may be due to a network issue or browser cache problem.
          </p>
          <button 
            onclick="window.location.reload()" 
            style="background: #8B4513; color: white; border: none; padding: 12px 32px; border-radius: 6px; font-size: 16px; font-weight: 500; cursor: pointer; transition: background 0.2s;"
            onmouseover="this.style.background='#6B3410'" 
            onmouseout="this.style.background='#8B4513'"
          >
            Retry
          </button>
        </div>
      </div>
    `;
  }
  hideLoadingScreen();
};

// Wrap initialization in try-catch
try {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error('Root element not found');
  }
  
  createRoot(root).render(<App />);
  hideLoadingScreen();
} catch (error) {
  handleModuleError(error as Error);
}
