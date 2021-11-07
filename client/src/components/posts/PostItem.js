import React from 'react';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import PropTypes from 'prop-types'

const PostItem = ({post}) => {
    const { title } = post;

    return (
        <div className="container-content">
            <Link to={`posts/${post._id}`}>
            <img src={post.image} alt="" />
            <h1 className="title">{title}</h1>
            <span>|| Posted by {post.name ? post.name : "undefined"} || Created at {formatDate(post.date)} ||</span>
            </Link>
        </div>
    )
}

PostItem.propTypes = {
    post: PropTypes.object.isRequired
}

export default PostItem;
