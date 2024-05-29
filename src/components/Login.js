import React, { useState, useContext } from 'react';
import axios from 'axios';
import Header from './Header';
import { AppContext } from '../AppContext';
import '../css/Login.css';

const Login = () => {
    const { login, setLanguage } = useContext(AppContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const fetchAndSetUserSettings = async (username) => {
        try {
            const settingsResponse = await axios.post('http://127.0.0.1:5000/get_user_settings', { username }, { withCredentials: true });
            if (settingsResponse.data) {
                const settings = settingsResponse.data;
                setLanguage(settings.defaultLanguage); // Set language from user settings
                localStorage.setItem('userSettings', JSON.stringify(settings)); // Save settings to local storage
            }
        } catch (error) {
            console.error('Error fetching and setting user settings:', error);
        }
    };

    const handleAuthAction = async (event) => {
        event.preventDefault();
        const endpoint = isRegistering ? 'register' : 'login';
        const data = { username, password };
        const url = `http://127.0.0.1:5000/${endpoint}`;

        try {
            const response = await axios.post(url, data, { withCredentials: true });
            if (response.data) {
                if (!isRegistering) {
                    await fetchAndSetUserSettings(username); // Fetch and set user settings after successful login
                    login({ username }); // Call login function with user data
                }
                console.log(response.data.message);
            }
        } catch (error) {
            alert(error.response?.data?.message || `${isRegistering ? 'Registration' : 'Login'} failed`);
        }
    };

    return (
        <div className="login-container">
            <Header title="Asystent w terapii jąkania" />
            <form onSubmit={handleAuthAction} className="login-form">
                <div>
                    <label>
                        Username:
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                </div>
                <div className="auth-buttons">
                    <button type="submit" onClick={() => setIsRegistering(false)}>Zaloguj</button>
                    <button type="submit" onClick={() => setIsRegistering(true)} className="register-button">Utwórz konto</button>
                </div>
            </form>
        </div>
    );


};

export default Login;
