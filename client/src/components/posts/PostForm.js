import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../../actions/post';

const PostForm = props => {
    const [formData, setFormData] = useState({
        title: "",
        subHeader: "",
        text: "",
        image: null
    });

    const [file, setFile] = useState("");
    const [error, setError] = useState("");
    const ref = useRef()

    const errors = useSelector(state => state.postReducer.errors);
    const dispatch = useDispatch();
    const history = useHistory();
    // console.log(errors.map(error => error.msg))

    const { title, subHeader, text} = formData;

    const onChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const fileChange = e => {
        const file = e.target.files[0];
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

        // Extract the file url to save in database
        const data = new FormData()
        if(file) {
            data.append("image", file);
        }
        data.append("title", title);
        data.append("subHeader", subHeader)
        data.append("text", text)
        dispatch(addPost(data));

        history.push("/")
    }

    return (
        <div className="form-container">
            <div className="post-content">
            <div className="title-content --titleForm">
                <h1>Add Post</h1>
            </div>
            <form className="" encType="multipart/form-data" onSubmit={onSubmit}>
                <div className="form-body">
                    {errors && errors.map((error, i) => (
                        <div className="errors" key={i}>{error.msg}</div>
                    ))}
                    {error && <div className="errors">{error}</div>}
                    {file && 
                    <div className="edit-post">
                        <img src={URL.createObjectURL(file)} alt="" />
                    </div>
                    }
                    {error && <div className="errors">{error}</div>}
                    <input type="file" name="image" ref={ref} onChange={fileChange} />
                    <div className="input">
                        <input type="text" name="title" value={title} placeholder="Title" onChange={onChange} />
                    </div>
                    <div className="input">
                        <input type="text" name="subHeader" value={subHeader} placeholder="Sub-Header" onChange={onChange} />
                    </div>
                    <div className="input">
                        <textarea name="text" value={text} placeholder="Content..." onChange={onChange} />
                    </div>
                </div>
                <div className="btn-submit">
                    <button type="submit">Publish</button>
                </div>
            </form>
            </div>
            </div>
        
    )
}

export default PostForm
