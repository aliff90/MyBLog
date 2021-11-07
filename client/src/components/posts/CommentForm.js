import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../../actions/post';
import PropTypes from 'prop-types'

const CommentForm = ({ postId }) => {
    const [comment, setComment] = useState({text: ""});
    const dispatch = useDispatch();
    const { isAuthenticated, errors } = useSelector(state => state.authReducer)

    const onChange = (e) => {
        if(!isAuthenticated) {
            setComment("Please Login to comment")
            return setTimeout(() => {
                setComment("")
            }, 3000)
        }

        setComment({text: e.target.value})
    }

    const onSubmit = e => {
        e.preventDefault();

        dispatch(addComment(postId, comment));

        setComment({text: ""})
    }

    return (
        <form onSubmit={onSubmit}>
        <div className="comment-body">
            <h2 className="comment-form-title">Leave a comment</h2>
            <div className="input">
            <textarea name="text" placeholder="Enter comment here..." value={comment.text} onChange={onChange} />
            </div>
            {errors && errors.map((error, i) => (
                <div className="errors" key={i}>{error.msg}</div>
            ))}
            {comment === "Please Login to comment" && <div className="errors">{comment}</div>}
            {isAuthenticated ? <button type="submit">Comment</button> : <button disabled="disabled" type="submit">Comment</button>}
            
        </div>
        </form>
    )
}

CommentForm.propTypes = {
    postId: PropTypes.string.isRequired
}


export default CommentForm;
