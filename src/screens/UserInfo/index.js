import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { callAPI } from '../../apis';
import ButtonStatusFriend from '../../components/ButtonStatusFriend';
import ListViewBlog from '../../components/ListViewBlog';
import { useTitle } from '../../core/customHook';
import { actSetIs404, actSetIsLoadingPage, processErrResponse } from '../../redux/actions/browser.action';
import Custom404 from '../404';
import './index.scss';

const UserInfo = () => {
    const { slugUser } = useParams();
    const { browserState: { token, is404 }, userState: { userInfo }} = useSelector(state => {
        return { browserState: state.browserState, userState: state.userState }
    })
    const history = useHistory();
    const dispatch = useDispatch();
    const [ userInfoPage, setUserInfoPage ] = useState('');
    const [ blog, setBlog ] = useState('');
    
    const getData = async () => {
        try {
            let getResult = await callAPI('/users/user_info', 'GET', { token }, { user: slugUser }, null);
            await setUserInfoPage(getResult.data.data);
            getResult = await callAPI('/blogs', 'GET', { token }, { user: slugUser }, null);
            await setBlog(getResult.data.data.blogs);
        }
        catch(err) {
            if(err.response) {
                processErrResponse(history, dispatch, err.response);
            }
        }
        finally {
            dispatch(actSetIsLoadingPage(false));
        }
    }
    useTitle(userInfoPage?.name);

    useEffect(() => {
        getData();
        dispatch(actSetIs404(false));
        return () => {
            dispatch(actSetIsLoadingPage(true));
        }
    }, [slugUser])
    
    // render
    if(is404) return <Custom404/>;

    return (
        userInfoPage &&
        <div className="user-info">
            <div className="info my-4">
                <div className="d-flex align-items-center flex-column mb-3">
                    <h3>Thông tin cá nhân</h3>
                    <hr/>
                </div>
                <div className='details-info'>
                    <img src={userInfoPage?.avatar} alt="avatar"></img>
                    <div>
                        <div className="mt-4"> 
                            <span className="fw-bold">Tên người dùng: </span>
                            <span>{userInfoPage?.name}</span>
                        </div>
                        <div className="mt-3"> 
                            <span className="fw-bold">Email: </span>
                            <span>{userInfoPage?.email}</span>
                        </div>
                        <div className="mt-3"> 
                            <span className="fw-bold">Số điện thoại: </span>
                            <span>{userInfoPage?.phone}</span>
                        </div>
                        <div className="mt-3"> 
                            <span className="fw-bold">Địa chỉ: </span>
                            <span>{userInfoPage?.address}</span>
                        </div>
                        <div className="mt-3"> 
                            <span className="fw-bold">Quốc gia: </span>
                            <span>{userInfoPage?.country}</span>
                        </div>
                        <div className="mt-3">
                            {userInfoPage?.slug === userInfo.slug ?
                            <span className="btn-user-update" onClick={() => history.push('/update_user_info')}><i className="fas fa-user-edit"></i> Cập nhật thông tin cá nhân</span>
                            :
                            <ButtonStatusFriend initFriend={userInfoPage?.friend} toSlugUser={slugUser}/>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="blogs mt-5">
                <div className="d-flex align-items-center flex-column mb-3">
                    <h3>Blog đã đăng</h3>
                    <hr/>
                </div>
                {blog.length > 0 ? <ListViewBlog blogs={blog}/> : <p className="text-center fst-italic">Chưa đăng bài blog nào</p>}
            </div>
        </div>
    )
}

export default UserInfo;