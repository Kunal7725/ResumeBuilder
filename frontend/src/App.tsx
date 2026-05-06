import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { BuilderPage } from './pages/BuilderPage';
import { useResumeStore } from './store/resumeStore';

const App: React.FC = () => {
  const { darkMode } = useResumeStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="app-root">
      <Navbar />
      <BuilderPage />
      <Toaster
        position="bottom-right"
        toastOptions={{ duration: 3000 }}
      />
    </div>
  );
};

export default App;
