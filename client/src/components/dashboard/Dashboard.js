import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../../actions/auth';
import { getPosts } from '../../actions/post';
import { Redirect } from 'react-router-dom';
import PostItem from '../posts/PostItem';

const Dashboard = props => {
    // Pagination
    const [pageNumber, setPageNumber] = useState(0);
    const [pages, setPages] = useState([]);
    const lastNumber = pages.length - 1;
    const firstNumber = pages[0]
    const currentPages = pageNumber + 1

    // Get state from redux
    const posts = useSelector(state => state.postReducer.posts.posts);
    const totalPages = useSelector(state => state.postReducer.posts.totalPages)

    useEffect(() => {
        dispatch(getPosts(pageNumber));

        // Total page
        let page=[]
        for(let i=0; i<totalPages; i++) {
            page.push(i)            
        }
        setPages(page)
        
    },[getPosts, pageNumber, totalPages])

    // const isAuthenticated = useSelector(state => state.authReducer.isAuthenticated);
    const user = useSelector(state => state.authReducer.user);
    const dispatch = useDispatch()
    // const logoutUser = () => {
    //     dispatch(logout());
    // }

    // if(!isAuthenticated) {
    //     return <Redirect to="/login" />
    // }

    // Pagination
    const onChangePage = (e) => {
        setPageNumber(parseInt(e.target.value))
    }
    
    const nextBtn = () => {
        setPageNumber(pageNumber + 1)
    }

    const prevBtn = () => {
        setPageNumber(pageNumber - 1)
    }

    return (
        <div className="container">
            {user && <div className="message"><h1>Welcome {user.name}</h1></div>}
            {posts && posts.map((post) => {
                return <PostItem key={post._id} post={post} />
            })}
            <div className="button-pagination">
                <button onClick={prevBtn} disabled={pageNumber === firstNumber  ? "disabled" : ""}>Prev</button>
                {pages && pages.map((page, i) => {
                    return <button key={i} value={page} className={page === pageNumber ? "active" : ""} onClick={onChangePage}>{page + 1}</button>
                })}
                <button onClick={nextBtn} disabled={pageNumber === lastNumber ? "disabled" : ""}>Next</button>
            </div>
        </div>
    )
}

export default Dashboard
