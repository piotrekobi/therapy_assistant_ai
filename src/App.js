// src/App.js

import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { AppContext } from './AppContext';
import GeneratorPage from './GeneratorPage';
import ChatPage from './ChatPage';
import IntonationTraining from './IntonationTraining';
import Statistics from './Statistics';
import Personalization from './Personalization';
import Community from './Community';
import PostDetail from './components/PostDetail';
import Login from './components/Login';
import Register from './components/Register';

export const App = () => {
    const { user, logout } = useContext(AppContext);

    return (
        <Router>
            <div>
                {user ? (
                    <div>
                        Logged in as {user.username}
                        <button onClick={logout}>Logout</button>
                    </div>
                ) : (
                    <nav>
                        <Link to="/login">Login</Link> |{" "}
                        <Link to="/register">Register</Link>
                    </nav>
                )}
            </div>
            <Routes>
                <Route path="/login" element={!user ? <Login /> : <Navigate replace to="/generator" />} />
                <Route path="/register" element={!user ? <Register /> : <Navigate replace to="/generator" />} />
                <Route path="/generator" element={user ? <GeneratorPage /> : <Navigate replace to="/login" />} />
                <Route path="/chat" element={user ? <ChatPage /> : <Navigate replace to="/login" />} />
                <Route path="/intonation-training" element={user ? <IntonationTraining /> : <Navigate replace to="/login" />} />
                <Route path="/statistics" element={user ? <Statistics /> : <Navigate replace to="/login" />} />
                <Route path="/personalization" element={user ? <Personalization /> : <Navigate replace to="/login" />} />
                <Route path="/community" element={user ? <Community /> : <Navigate replace to="/login" />} />
                <Route path="/posts/:postId" element={user ? <PostDetail /> : <Navigate replace to="/login" />} />
                <Route path="/" element={<Navigate replace to={user ? "/generator" : "/login"} />} />
            </Routes>
        </Router>
    );
};

export default App;
