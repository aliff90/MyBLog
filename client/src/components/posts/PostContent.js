import React, { useState,useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPost, deletePost, addLike, removeLike,getPosts } from '../../actions/post';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import PostComment from './PostComment';
import CommentForm from './CommentForm';
import { useHistory } from 'react-router';

const PostContent = ({match}) => {
    const [likes, setLikes] = useState(0)
    const history = useHistory()
    const dispatch = useDispatch();
    const loading = useSelector(state => state.postReducer.loading);
    const {isAuthenticated, user} = useSelector(state => state.authReducer)
    const post =  useSelector(state => state.postReducer.post);
    const postId = match.params.id;

    useEffect(() => {
        dispatch(getPost(postId));
        dispatch(getPosts(0))
        setLikes(post.likes)
   },[likes,loading])

    const deleteMe = () => {
        dispatch(deletePost(postId));
        history.push("/")
    };
   
    const addLikes = () => {
        dispatch(addLike(postId))
        const like = setLikes(post.likes)
        setLikes(like)
    };

    const removeLikes = () => {
        dispatch(removeLike(postId))
        const like = setLikes(post.likes)
        setLikes(like)
    }

    return (
        <div className="post-container">
            <div className="post-content">
                <div className="title-content">
                    <div className="post-image">
                        <img src={post.image} alt="" />
                    </div>
                    <div className="icons">
                        {isAuthenticated  && post.user === user._id && <Link className="edit-icon" to={`/edit/${postId}`}><i className="fa fa-edit" /> </Link>}
                        {isAuthenticated  && post.user === user._id && <span onClick={deleteMe} className="trash-icon"><i className="fa fa-trash-o" /></span>}
                    </div>
                    <h1>{post.title}</h1>
                    
                    <div className="post-info">
                        <span>|| Created by {post.name} || Created at {post.date && formatDate(post.date)} ||</span>
                    </div>
                </div>
                <div className="post-body">
                    {post.contents && <h2 className="subHeader">{post.contents.subHeader}</h2>}
                    {post.contents && <p className="text">{post.contents.text}</p>}
                </div>
                <div className="post-likes">
                    <i className="fa" onClick={addLikes}>&#xf087;</i> Like | { post.likes && post.likes.length} | <i className="fa" onClick={removeLikes}>&#xf165;</i>
                </div>
                <div className="post-comments">
                    {post.comments && <h2 className="comments-title">{post.comments.length} Comments:</h2>}
                    {post.comments && post.comments.map((comment) => {
                        return <PostComment comment={comment} postId={postId} key={comment._id} />  
                    })}
                    <CommentForm postId={postId} />
                </div>
            </div>
        </div>
    )
}


export default PostContent;
