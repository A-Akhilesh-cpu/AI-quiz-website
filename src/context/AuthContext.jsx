import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getUsers() {
    const stored = localStorage.getItem('brainspark_users');
    return stored ? JSON.parse(stored) : [];
}

function saveUsers(users) {
    localStorage.setItem('brainspark_users', JSON.stringify(users));
}

function getUserHistory(userId) {
    const stored = localStorage.getItem(`brainspark_history_${userId}`);
    return stored ? JSON.parse(stored) : [];
}

function saveUserHistory(userId, history) {
    localStorage.setItem(`brainspark_history_${userId}`, JSON.stringify(history));
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('brainspark_currentUser');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('brainspark_currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('brainspark_currentUser');
        }
    }, [user]);

    const register = (name, email, password) => {
        const users = getUsers();

        // Check duplicate email
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error('An account with this email already exists.');
        }

        const newUser = {
            id: generateId(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password, // In production, hash this!
            createdAt: new Date().toISOString(),
            totalQuizzes: 0,
            bestScore: 0,
            totalCorrect: 0,
            totalQuestions: 0,
        };

        users.push(newUser);
        saveUsers(users);

        const { password: _, ...safeUser } = newUser;
        setUser(safeUser);
        return safeUser;
    };

    const login = (email, password) => {
        const users = getUsers();
        const found = users.find(
            u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
        );

        if (!found) {
            throw new Error('Invalid email or password.');
        }

        const { password: _, ...safeUser } = found;
        setUser(safeUser);
        return safeUser;
    };

    const logout = () => {
        setUser(null);
    };

    const updateUserStats = (quizResult) => {
        if (!user) return;

        const users = getUsers();
        const idx = users.findIndex(u => u.id === user.id);
        if (idx === -1) return;

        users[idx].totalQuizzes = (users[idx].totalQuizzes || 0) + 1;
        users[idx].totalCorrect = (users[idx].totalCorrect || 0) + quizResult.correct;
        users[idx].totalQuestions = (users[idx].totalQuestions || 0) + quizResult.total;
        users[idx].bestScore = Math.max(users[idx].bestScore || 0, quizResult.percentage);

        saveUsers(users);

        // Update current user state
        const { password: _, ...safeUser } = users[idx];
        setUser(safeUser);

        // Save to history
        const history = getUserHistory(user.id);
        history.unshift(quizResult);
        saveUserHistory(user.id, history.slice(0, 50)); // Keep last 50
    };

    const getHistory = () => {
        if (!user) return [];
        return getUserHistory(user.id);
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout, updateUserStats, getHistory }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
