// src/components/NotificationLabel.js
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppContext';
import '../css/NotificationLabel.css';


const NotificationLabel = () => {
  const { notification } = useContext(AppContext);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    let fadeOutTimer;
    if (notification.visible) {
      setFade(false); // Show the notification immediately
      // Start fading out after a delay
      fadeOutTimer = setTimeout(() => {
        setFade(true);
      }, 500); // Delay before starting to fade out
    }

    return () => clearTimeout(fadeOutTimer);
  }, [notification]);

  const labelStyle = {
    opacity: notification.visible ? (fade ? '0' : '1') : '0',
    transition: fade ? 'opacity 3s ease-out' : 'none',
    pointerEvents: 'none'
  };

  return (
    <label className="notification" style={labelStyle}>
      {notification.text}
    </label>
  );
};

export default NotificationLabel;
