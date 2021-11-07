import React from 'react';
import { deleteComment } from '../../actions/post';
import formatDate from '../../utils/formatDate';
import { useSelector, useDispatch } from 'react-redux';


const PostComment = ({ comment, postId }) => {
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.authReducer)

    
    const onClick = () => {
        dispatch(deleteComment(postId, comment._id));
    }

    return (
        <div className="container-comments">
            <div className="comments">
            {user && comment.user === user._id && 
                <div  className="x-btn">
                    <span onClick={onClick}><i className="fa fa-trash-o" /></span>
                </div>}
            
            <h3>{comment.name} </h3>
            <span>{formatDate(comment.date)}</span>
            <p>{comment.text}</p>
            </div>
        </div>
    )
}

export default PostComment;
