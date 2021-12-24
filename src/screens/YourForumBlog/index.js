import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { callAPI } from '../../apis';
import './index.scss';
import { useTitle } from '../../core/customHook';
import { actSetIsLoadingPage, processErrResponse, setNotify } from '../../redux/actions/browser.action';
import ForumBlog from '../../components/ForumBlog';

const YourForumBlog = () => {
    useTitle("Bài viết của bạn");
    const { browserState: { token }, userState: { userInfo } } = useSelector(state => {
        return { browserState: state.browserState , userState: state.userState};
    })
    const history = useHistory();
    const dispatch = useDispatch();

    // get your forum blogs 
    const [ yourForumBlogs, setYourForumBlogs ] = useState([]);
    const [ pagingBlogs, setPagingBlogs ] = useState({});
    // get forum blogs
    const getYourForumBlogs = async () => {
        try {
            const result = await callAPI('/forum_blogs', 'GET', {token}, { type: "user" }, null);
            setYourForumBlogs(result.data.data.forumBlogs);
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
        finally {
            dispatch(actSetIsLoadingPage(false));
        }
    }

    useEffect(() => {
        getYourForumBlogs();
        return () => {
            dispatch(actSetIsLoadingPage(true));
        }
    }, [])

    // delete your forum blog
    const onSubmitDelete = async (id_blog, index) => {
        try {
            await callAPI(`/forum_blogs/${id_blog}`, 'DELETE', { token }, null, null);
            await setYourForumBlogs([...yourForumBlogs.slice(0, index), ...yourForumBlogs.slice(index + 1)]);
            dispatch(setNotify({message: "Đã xóa bài viết", success: true}));
        }
        catch(err) {
            if(err.response) {
                processErrResponse(history, dispatch, err.response);
            }
        }
    }

    return (
        <>
        <div className="your-forum-blog">
            <h3 className="mt-3 text-center">Bài viết đã đăng</h3>
            <hr/>
            {yourForumBlogs.length > 0 ? 
            <div className="forum-blogs">
                {yourForumBlogs.map((blog, index) => <ForumBlog forumBlog={blog} key={blog.blog._id} indexBlog={index} onSubmitDelete={onSubmitDelete}/>)}
            </div>
            : 
            <div className="no-blogs mt-4 box-border text-center py-3">
                Bạn chưa đăng bài viết nào!
            </div>}
        </div>
        </>
    )
}

export default YourForumBlog;