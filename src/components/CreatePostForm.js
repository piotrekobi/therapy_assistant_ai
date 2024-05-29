// src/components/CreatePostForm.js
import React, { useState } from 'react';
import axios from 'axios';
import '../css/CreatePostForm.css';  // Ensure the CSS file is correctly imported

export const CreatePostForm = ({ fetchPosts }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://127.0.0.1:5000/add_post', { title, content });
        setTitle('');
        setContent('');
        fetchPosts();
    };

    return (
        <form onSubmit={handleSubmit} className="create-post-form"> {/* Apply the CSS class here */}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tytuł"
                required
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Treść posta"
                required
            />
            <button type="submit">Dodaj post</button>
        </form>
    );
};

export default CreatePostForm;
