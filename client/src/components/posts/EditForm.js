import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost, getPost, getPosts } from '../../actions/post';

const PostForm = ({match}) => {
    const [formData, setFormData] = useState({
        title: "",
        subHeader: "",
        text: "",
        image: ""
    });
    const [file, setFile] = useState("");
    const [error, setError] = useState("")
    const { title, subHeader, text } = formData;
    const id = match.params.id;

    // Redux hooks
    const dispatch = useDispatch();
    const post = useSelector(state => state.postReducer.post);
    const posts = useSelector(state => state.postReducer.posts.posts);
    const errors = useSelector(state => state.postReducer.errors);
    const loading = useSelector(state => state.postReducer.loading);

    // React router
    const history = useHistory();

    useEffect(() => {
        dispatch(getPosts())
        dispatch(getPost(id))
        if(post) {
            setFormData({
                title: post.title,
                subHeader: post.contents.subHeader,
                text: post.contents.text,
                image: post.image
            })
        }
    },[loading]);


    const onChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const goBack = () => {
        history.push(`/posts/${id}`)
    }

    const fileChange = e => {
        const file = e.target.files[0];
        console.log(file)
        if(file === undefined) {
            console.log("undefined")
            setFile(null)
        } else if(file.type === "image/png" || file.type === "image/jpeg") {
            if(file.size < 1000000) {
                setFile(file) 
            } else {
                setError("Please upload the correct size")
                setFile(null)
                
                setTimeout(() => {
                    setError("")
                },3000)
            }
        } else {
            setError("Please upload the correct file");
            setFile(null)

            setTimeout(() => {
                setError("")
            },3000)
        }
    }
    
    const onSubmit = async e => {
        e.preventDefault();

        const data = new FormData()
        if(file) {
            data.append("image", file);
        }
        data.append("title", title);
        data.append("subHeader", subHeader)
        data.append("text", text)

        const updated = () => {
            dispatch(updatePost(id, data));
        }

        await updated()
        
        history.push(`/posts/${id}`)
    }

    return (
        <div className="form-container">
            <div className="post-content">
                <div className="title-content --titleForm">
                    <h1>Edit Post</h1>
                </div>
                <div className="form-style">
                <form className="" onSubmit={onSubmit}>
                    <div className="form-body">
                    {errors && errors.map((error, i) => (
                            <div className="errors" key={i}>{error.msg}</div>
                        ))}
                    {file ?
                        (<div className="edit-image">
                            <img src={URL.createObjectURL(file)} alt="" />
                        </div>) :
                        (<div className="edit-image">
                            <img src={post.image} alt="" /> 
                        </div>)
                    }
                    {error && <div className="errors">{error}</div>}
                    <input type="file" name="image" onChange={fileChange} />
                    <div className="input">
                        { !loading && post.title && <input type="text" name="title" value={title} placeholder="Title" onChange={onChange} />}
                    </div>
                    <div className="input">
                        {post.contents && <input type="text" name="subHeader" value={subHeader} placeholder="Sub-Header" onChange={onChange} />}
                    </div>
                    <div className="input">
                        {post.contents && <textarea name="text" value={text} placeholder="Content..." onChange={onChange} />}
                    </div>
                    </div>
                    <button type="submit">Edit</button>
                    <button type="button" className="back-btn" onClick={goBack} className="back-btn">Back</button>
                </form>
                </div>
            </div>
        </div>
    )
}

export default PostForm;
