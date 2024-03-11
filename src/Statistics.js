// src/Statistics.js

import React, { useState, useEffect, useContext } from 'react';
import Header from './components/Header';
import { AppContext } from './AppContext';
import './css/Statistics.css';

export const Statistics = () => {
    const { user } = useContext(AppContext);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchStats = async () => {
                try {
                    const response = await fetch('http://127.0.0.1:5000/get_statistics', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            // Add any other headers your server requires
                        },
                        credentials: 'include', // Important for sessions to work
                        body: JSON.stringify({ username: user.username }),
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setStats(data);
                    } else {
                        console.error('Failed to fetch statistics');
                    }
                } catch (error) {
                    console.error('Error fetching statistics:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchStats();
        }
    }, [user]);

    return (
        <div>
            <Header title="Statystyki" />
            <div className="stats-container">
                {isLoading ? (
                    <div>Wczytywanie statystyk...</div>
                ) : stats ? (
                    <>
                        <div>Nagrania wysłane asystentowi: {stats.recordings || 0}</div>
                        <div>Wygenerowane zestawy samogłosek: {stats.vowels || 0}</div>
                        <div>Wygenerowane zestawy słów: {stats.words || 0}</div>
                        <div>Wygenerowane zdania: {stats.sentences || 0}</div>
                        <div>Dni ćwiczeń: {stats.days || 0}</div>
                    </>
                ) : (
                    <div>Brak statystyk.</div>
                )}
            </div>
        </div>
    );
};

export default Statistics;
