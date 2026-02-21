import { useState, useEffect, Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import Admin from './pages/Admin';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import HistoryDetail from './pages/HistoryDetail';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#fff', background: '#1a1a2e', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️ Something went wrong</h1>
          <p style={{ color: '#aaa', marginBottom: '1rem', maxWidth: 600, wordBreak: 'break-word' }}>{this.state.error?.message}</p>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', background: '#6C63FF', color: '#fff', cursor: 'pointer', fontSize: '1rem', marginRight: '0.5rem' }}>Clear Data & Reload</button>
          <button onClick={() => window.location.reload()} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', background: '#333', color: '#fff', cursor: 'pointer', fontSize: '1rem', marginTop: '0.5rem' }}>Reload Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem('darkMode');
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <QuizProvider>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/result" element={<Result />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/history/:id" element={<HistoryDetail />} />
            </Routes>
          </QuizProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
