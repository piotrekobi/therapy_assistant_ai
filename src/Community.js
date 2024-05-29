// src/Community.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import { CreatePostForm } from './components/CreatePostForm';
import './css/Community.css'; // Make sure the path is correct

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
        <div><Header title="Społeczność" />
            <div className="community-container">  {/* Ensured class name is used */}

                <CreatePostForm fetchPosts={fetchPosts} />
                <div className="posts-container"> {/* Added a class for styling */}
                    {Object.entries(posts).map(([postId, post]) => (
                        <div key={postId} className="post"> {/* Ensured class name is used */}
                            <Link to={`/posts/${postId}`}>
                                <h3>{post.title}</h3>
                            </Link>
                            <p>{post.content.substring(0, 100)}...</p> {/* Extended content preview */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Community;
