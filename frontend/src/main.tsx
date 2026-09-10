import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from "./locales/LanguageContext";

createRoot(document.getElementById("root")!).render(<LanguageProvider>
  <App />
</LanguageProvider>);
