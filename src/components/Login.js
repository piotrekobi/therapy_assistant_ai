import React, { useState, useContext } from 'react';
import axios from 'axios';
import Header from './Header';
import { AppContext } from '../AppContext'; // Import AppContext to use the login and other functions

const Login = () => {
    const { login, setLanguage } = useContext(AppContext); // Use the login and setLanguage functions from AppContext
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const fetchAndSetUserSettings = async (username) => {
        try {
            const settingsResponse = await axios.post('http://127.0.0.1:5000/get_user_settings', { username }, { withCredentials: true });
            if (settingsResponse.data) {
                const settings = settingsResponse.data;
                setLanguage(settings.defaultLanguage); // Update the language in the context
                localStorage.setItem('userSettings', JSON.stringify(settings)); // Save settings to local storage
            }
        } catch (error) {
            console.error('Error fetching and setting user settings:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/login', { username, password }, { withCredentials: true });
            if (response.data && response.status === 200) {
                await fetchAndSetUserSettings(username); // Fetch and set user settings after successful login
                login({ username }); // Call login function with user data
                alert(response.data.message); // Display success message
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed'); // Display error message
        }
    };

    return (
        <div>
            <Header title="Społeczność" />
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
