import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import { CreatePostForm } from './components/CreatePostForm';

export const Community = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const response = await axios.get('http://127.0.0.1:5000/get_posts');
        setPosts(response.data);
    };

    return (
        <div>
            <Header title="Społeczność" />
            <CreatePostForm fetchPosts={fetchPosts} />
            <div>
                {Object.entries(posts).map(([postId, post]) => (
                    <div key={postId}>
                        <Link to={`/posts/${postId}`}>
                            <h3>{post.title}</h3>
                        </Link>
                        <p>{post.content.substring(0, 20)}...</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;
