import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useTitle } from '../../core/customHook';
import { Tab, Tabs } from 'react-bootstrap';
import './index.scss';
import { useEffect, useState } from 'react';
import { actSetIsLoadingPage, processErrResponse, setNotify } from '../../redux/actions/browser.action';
import { useHistory } from 'react-router';
import { callAPI } from '../../apis';
import { changeTime } from '../../utils/supports';
import ButtonStatusFriend from '../../components/ButtonStatusFriend';
import ListViewBlog from '../../components/ListViewBlog';
import ForumBlog from '../../components/ForumBlog';

const SearchHome = () => {
    useTitle("Tìm kiếm");
    const { browserState: { token }, otherState: { inputSearchHome } } = useSelector(state => {
        return { browserState: state.browserState, otherState: state.otherState };
    })
    const history = useHistory();
    const dispatch = useDispatch();
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        const inputSearchHomeTarget = inputSearchHome.current
        return () => {
            if(inputSearchHomeTarget) inputSearchHomeTarget.value = "";
        }
    }, [inputSearchHome])

    const keyword = useQuery().get('keyword');
    const [ key, setKey ] = useState(useQuery().get('keySearch'));
    const [ users, setUsers ] = useState([]);
    const [ forumBlogs, setForumBlogs ] = useState([]);
    const [ blogs, setBlogs ] = useState([]);

    const getData = async () => {
        setIsLoading(true);
        try {
            switch(key) {
                case "user": 
                    {
                        history.replace(`/search?keySearch=user&&keyword=${keyword}`);
                        const result = await callAPI('/search/users', 'GET', { token }, { keyword }, null);
                        setUsers(result.data.data.users);
                        return
                    }
                case "forum_blogs": 
                    {
                        history.replace(`/search?keySearch=forum_blogs&&keyword=${keyword}`);
                        const result = await callAPI('/search/forum_blogs', 'GET', { token }, { keyword }, null);
                        setForumBlogs(result.data.data.forumBlogs);
                        return
                    }
                case "blogs": 
                    {
                        history.replace(`/search?keySearch=blogs&&keyword=${keyword}`);
                        const result = await callAPI('/search/blogs', 'GET', { token }, { keyword }, null);
                        setBlogs(result.data.data.blogs);
                        return
                    }
                default: 
                    {
                        dispatch(processErrResponse(history, dispatch, { status: 404 }));
                        return
                    }
            }
        }
        catch(err) {
            if(err.response) {
                processErrResponse(history, dispatch, err.response);
            }
        }
        finally {
            setIsLoading(false);
            dispatch(actSetIsLoadingPage(false));
        }
    }

    // delete search forum blog
    const onSubmitDelete = async (id_blog, index) => {
        try {
            await callAPI(`/forum_blogs/${id_blog}`, 'DELETE', { token }, null, null);
            await setForumBlogs([...forumBlogs.slice(0, index), ...forumBlogs.slice(index + 1)]);
            dispatch(setNotify({message: "Đã xóa bài viết", success: true}));
        }
        catch(err) {
            if(err.response) {
                processErrResponse(history, dispatch, err.response);
            }
        }
    }

    useEffect(() => {
        getData();
    }, [key, keyword])

    useEffect(() => {
        return () => {
            dispatch(actSetIsLoadingPage(true));
        }
    }, [])

    return (
        <div className="search-page p-4">
            <Tabs activeKey={key} id="controlled-tab-example" className="mb-3" onSelect={(k) => setKey(k)}> 
                <Tab eventKey="user" title="Người dùng">
                    {users.length > 0 ? 
                    <div className="search-user d-flex flex-wrap justify-content-between">
                        {isLoading ? 
                        <div className="text-center mt-3">
                            <div className="spinner-border" role="status" style={{"color": "#3d41bed4"}}></div>
                        </div>
                        :      
                        users.map((user) => {
                            return (
                                <div className="card-info" key={user.slug}>
                                    <div className="search-user-info">
                                        <img src={user.avatar} alt="avatar-user" onClick={() => history.push(`/${user.slug}`)}></img>
                                        <div className="ms-2">
                                            <span className="fw-bold name-user" onClick={() => history.push(`/${user.slug}`)}>{user.name}</span><br/>
                                        </div>
                                    </div>
                                    <ButtonStatusFriend initFriend={user.friend} toSlugUser={user.slug}/>
                                </div>
                            )
                        })}
                    </div>
                    :
                    <div className="no-data">Không tìm thấy người dùng phù hợp!</div>}
                </Tab>
                <Tab eventKey="forum_blogs" title="Bài viết">
                    {isLoading ? 
                    <div className="text-center mt-3">
                        <div className="spinner-border" role="status" style={{"color": "#3d41bed4"}}></div>
                    </div>
                    :  
                    forumBlogs.length > 0 ? 
                    <div>
                        {forumBlogs.map((blog, index) => <ForumBlog forumBlog={blog} key={blog.blog._id} indexBlog={index} onSubmitDelete={onSubmitDelete}/>)}
                    </div>
                    :
                    <div className="no-data">Không tìm thấy bài viết phù hợp!</div>}
                </Tab>
                <Tab eventKey="blogs" title="Bài viết blog">
                    {isLoading ? 
                        <div className="text-center mt-3">
                            <div className="spinner-border" role="status" style={{"color": "#3d41bed4"}}></div>
                        </div>
                    :  
                    blogs.length > 0 ? 
                    <ListViewBlog blogs={blogs}/>
                    :
                    <div className="no-data">Không tìm thấy bài blog phù hợp!</div>}
                </Tab>
            </Tabs>
        </div>
    )
}

export default SearchHome;

