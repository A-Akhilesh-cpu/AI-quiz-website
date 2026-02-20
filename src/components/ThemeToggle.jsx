import { HiSun, HiMoon } from 'react-icons/hi2';
import './ThemeToggle.css';

export default function ThemeToggle({ darkMode, setDarkMode }) {
    const toggle = () => {
        setDarkMode(!darkMode);
    };

    return (
        <button
            className="theme-toggle"
            onClick={toggle}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Light mode' : 'Dark mode'}
        >
            <span className={`toggle-icon ${darkMode ? 'hidden' : ''}`}><HiSun /></span>
            <span className={`toggle-icon ${!darkMode ? 'hidden' : ''}`}><HiMoon /></span>
        </button>
    );
}
