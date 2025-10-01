import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './providers/theme-provider.jsx'
import { I18nextProvider } from 'react-i18next'
import i18n from "./i18n";

// Error handler
const handleError = (error) => {
  console.error('Application Error:', error);
  // Show error on page
  document.body.innerHTML = `
    <div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#1a1a1a;color:white;padding:20px;direction:rtl;text-align:right;">
      <div>
        <h1 style="color:red;margin-bottom:20px;">خطأ في التطبيق</h1>
        <p style="margin-bottom:10px;">حدث خطأ أثناء تحميل التطبيق:</p>
        <pre style="background:#333;padding:10px;border-radius:4px;margin-top:10px;direction:ltr;">${error.message}</pre>
        <button onclick="location.reload()" style="margin-top:20px;padding:8px 16px;background:#4a5568;border:none;color:white;border-radius:4px;cursor:pointer;">
          إعادة تحميل الصفحة
        </button>
      </div>
    </div>
  `;
};

// Initialize app
try {
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root element not found');
  }

  const root = createRoot(container);

  // Add base styles
  document.documentElement.classList.add('h-full');
  document.body.classList.add('h-full', 'bg-background', 'text-foreground');
  
  root.render(
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <App />
        </ThemeProvider>
      </I18nextProvider>
    </StrictMode>
  );
} catch (error) {
  handleError(error);
  // Show a basic error message if rendering fails
  document.body.innerHTML = `
    <div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#1a1a1a;color:white;text-align:center;padding:20px;">
      <div>
        <h1 style="color:red;margin-bottom:20px;">خطأ في التحميل</h1>
        <p>عذراً، حدث خطأ أثناء تحميل التطبيق. يرجى تحديث الصفحة.</p>
        <pre style="margin-top:20px;padding:10px;background:#333;border-radius:4px;font-size:12px;">${error.message}</pre>
      </div>
    </div>
  `;
}