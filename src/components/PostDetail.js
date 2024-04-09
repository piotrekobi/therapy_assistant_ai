import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from './Header';
import { useParams } from 'react-router-dom';

export const PostDetail = () => {
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
    const { postId } = useParams();

    const fetchPost = useCallback(async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/get_post/${postId}`);
            setPost(response.data);
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    }, [postId]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    const addComment = async () => {
        try {
            await axios.post(`http://127.0.0.1:5000/add_comment/${postId}`, { content: comment });
            setComment('');
            fetchPost(); // This call should now be safe from creating an infinite loop
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (!post) return <div>Loading...</div>;

    return (
        <div>
            <Header title={post.title} />
            <p>{post.content}</p>
            <div>
                <h4>Komentarze:</h4>
                {post.comments?.map((comment, index) => (
                    <p key={index}>{comment.content}</p>
                ))}
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Dodaj komentarz"
                />
                <button onClick={addComment}>Wyślij</button>
            </div>
        </div>
    );
};

export default PostDetail;
