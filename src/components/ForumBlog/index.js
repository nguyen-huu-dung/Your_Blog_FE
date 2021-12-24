import { Modal, Dropdown } from 'react-bootstrap';
import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { callAPI } from "../../apis";
import { processErrResponse, setNotify } from "../../redux/actions/browser.action";
import { changeTime, cutStringContent } from "../../utils/supports";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Comment from '../Comment';
import './index.scss';
import ButtonStatusFriend from '../ButtonStatusFriend';
import { SocketContext } from '../../core/config/socket.config';
import CKE5Input from '../CKEditer5';

const ForumBlog = ({forumBlog, indexBlog, onSubmitDelete}) => {
    
    const { browserState: { token }, userState: { userInfo }} = useSelector((state) => {
        return { browserState: state.browserState, userState: state.userState };
    }) 
    const history = useHistory();
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);

    const [ blog, setBlog ] = useState(forumBlog.blog);
    const [ contentBlog, setContentBlog ] = useState("");
    const [ likes, setLikes ] = useState(forumBlog.likes);
    const [ comments, setComments ] = useState(forumBlog.comments);


    useEffect(() => {
        setContentBlog(cutStringContent(blog.description));
    }, [blog])

    // edit blog
    const [showUpdateBlog, setShowUpdateBlog] = useState(false);
    const [updateResult, setUpdateResult] = useState({message: "", success: true});
    const [ descriptionContent, setDescriptionContent ] = useState("");
    const [ descriptionValidate, setDescriptionValidate ] = useState("");
    // form validates update
    const validateSchema = yup.object().shape({
        title: yup.string().min(4, "Tối thiểu 4 ký tự").max(200, 'Tối đa 200 kí tự').required('Không thể bỏ trống'),
    })

    // use hook form
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({resolver: yupResolver(validateSchema)});
    const handleUpdateClose = () => setShowUpdateBlog(false);
    const handleUpdateShow = () => {
        setShowUpdateBlog(true);
        reset();
        setDescriptionContent(blog.description);
        setUpdateResult({message: "", success: true});
    };

    // update blog
    const onSubmitUpdate = async (data) => {
        if(descriptionContent === "") return await setDescriptionValidate('Không thể bỏ trống');
        if(descriptionContent.length < 20) return await setDescriptionValidate('Tối thiểu 20 kí tự');
        setDescriptionValidate("");
        try {
            const result = await callAPI(`/forum_blogs/${blog._id}`, 'PUT', { token }, null, {...data, description: descriptionContent});
            setBlog(result.data.data.blog);
            setLikes({...likes, paging: {...likes.paging, totalRecords: result.data.data.likes.paging.totalRecords}});
            setComments({...comments, paging: {...comments.paging, totalRecords: result.data.data.comments.paging.totalRecords}})
            handleUpdateClose();
            dispatch(setNotify({message: "Cập nhật bài viết thành công", success: true}));
        }
        catch(err) {
            if(err.response) {
                if(err.response.status === 400) {
                    setUpdateResult({message: err.response.data.message, success: false});
                }
                else {
                    processErrResponse(history, dispatch, err.response);
                }
            }
        }
    }

    // delete blog
    const [showDeleteBlog, setShowDeleteBlog] = useState(false);
    const handleDeleteClose = () => setShowDeleteBlog(false);
    const handleDeleteShow = () =>  setShowDeleteBlog(true);

    // get likes
    const getLikes = async () => {
        try {
            const result = await callAPI(`/forum_blogs/${blog._id}/likes`, 'GET', { token }, null, null);
            setLikes(result.data.data);
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    // process like or dislike
    const likeOrUnlike = async (type) => {
        try {
            await callAPI(`/forum_blogs/${blog._id}/likes`, 'PUT', { token }, null, {type});
            if(type === 'like') {
                setLikes({...likes, paging: {...likes.paging, totalRecords: likes.paging.totalRecords + 1}, liked: true});
                dispatch(setNotify({message: "Đã like bài viết", success: true}));
            }
            else {
                setLikes({...likes, paging: {...likes.paging, totalRecords: likes.paging.totalRecords - 1}, liked: false});
                dispatch(setNotify({message: "Đã bỏ like bài viết", success: true}));
            }   
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    // show user like
    const [showUserLike, setShowUserLike] = useState(false);
    const handleUserLikeClose = () => setShowUserLike(false);
    const handleUserLikeShow = async () => {
        await getLikes();
        setShowUserLike(true);
    };

    // show comment
    const [ showComment, setShowComment ] = useState(false);
    // get likes
    const getComments = async () => {
        try {
            const result = await callAPI(`/forum_blogs/${blog._id}/comments`, 'GET', { token }, null, null);
            setComments(result.data.data);
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    const handleShowComment = async () => {
        if(!showComment) await getComments();
        setShowComment(!showComment); 
    }

    const { register: register2, handleSubmit: handleSubmit2, reset: reset2 } = useForm();
    // submit comment
    const onSubmitComment = async (data) => {
        if(data.comment === "") return;
        else {
            try {
                const result =  await callAPI(`/forum_blogs/${blog._id}/comments`, 'POST', { token }, null, {content: data.comment});
                if(result.data.data.notify !== null) {
                    await socket.emit('sendNotify', result.data.data.notify);
                }
                setComments({paging: {...comments.paging, totalRecords: comments.paging.totalRecords + 1}, comments: [result.data.data, ...comments.comments]})
                reset2();
                dispatch(setNotify({message: "Đã thêm bình luận mới", success: true}));
            }
            catch(err) {
                if(err.response) processErrResponse(history, dispatch, err.response);
            }
        }
    }
    // update comment
    const onUpdateComment = async (id_comment, content, index_comment) => {
        try {
            const result =  await callAPI(`/forum_blogs/${blog._id}/comments/${id_comment}`, 'PUT', { token }, null, { content });
            setComments({...comments, comments: [...comments.comments.slice(0, index_comment), result.data.data, ...comments.comments.slice(index_comment + 1)]});
            dispatch(setNotify({message: "Cập nhật bình luận thành công", success: true}));
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    // delete comment
    const onDeleteComment = async (id_comment, index_comment) => {
        try {
            await callAPI(`/forum_blogs/${blog._id}/comments/${id_comment}`, 'DELETE', { token }, null, null);
            setComments({paging: {...comments.paging, totalRecords: comments.paging.totalRecords - 1}, comments: [...comments.comments.slice(0, index_comment), ...comments.comments.slice(index_comment + 1)]});
            dispatch(setNotify({message: "Đã xóa bình luận", success: true}));
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    return (
        <div className="forum-blog box-border my-4">
            <div className="blog-head p-4 d-flex justify-content-between align-items-center">
                <div className="left-blog-head d-flex">
                    <img src={blog?.user?.avatar.path} width={45} heigt={45} alt="user-avatar" onClick={() => history.push(`/${blog?.user.slug}`)}/>
                    <div className="blog-info ms-3">
                        <span className="fw-bold user-name" onClick={() => history.push(`/${blog?.user.slug}`)}>{blog?.user.name}</span><br/>
                        <span className="text-secondary" style={{"fontSize": "14px"}}><i className="fas fa-globe-asia"></i> {changeTime(blog?.created)}</span>
                    </div>  
                </div>
                {userInfo?.slug === blog?.user.slug ?
                <Dropdown align="end">
                    <Dropdown.Toggle>
                        <i className="fas fa-ellipsis-h fs-5"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="box-border">
                        <Dropdown.Item onClick={handleUpdateShow}><span><i className="far fa-edit"></i> Chỉnh sửa bài viết</span></Dropdown.Item>
                        <Dropdown.Item onClick={handleDeleteShow}><span><i className="far fa-trash-alt"></i> Xóa bài viết</span></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                :
                <i className="fas fa-ellipsis-h fs-5 disabled"></i>
                }
            </div>
            <div className="blog-content px-4">
                <h4>{blog?.title}</h4>
                <CKE5Input readOnly={true} type={'forum-blog'} descriptionContent={blog?.description} setDescriptionContent={setDescriptionContent}/>
            </div>
            <div className="action-info px-4 py-3 d-flex justify-content-between">
                <span><i className="fas fa-thumbs-up" onClick={async () => { handleUserLikeShow() }}></i> {likes?.paging.totalRecords}</span>
                <span>{comments?.paging.totalRecords} bình luận</span>
            </div>
            <hr className="my-0 mx-auto" style={{"width": "95%"}}/>
            <div className="action d-flex justify-content-center py-1">
                {likes?.liked ? <span className="fw-bold text-center" onClick={() => likeOrUnlike('unlike')}><i className="fas fa-thumbs-up"></i> Thích</span>
                :
                <span className="text-center" onClick={() => likeOrUnlike('like')}><i className="far fa-thumbs-up"></i> Thích</span>}
                <span className="text-center" onClick={() => handleShowComment()}><i className="far fa-comment-alt"></i> Bình luận</span>
            </div>
            <hr className="my-0 mx-auto" style={{"width": "95%"}}/>
            {showComment && 
            <div className="comment px-4 py-3">
                <div className="upload-comment d-flex justify-content-between align-items-center">
                    <img src={userInfo?.avatar} width={35} height={35} alt="user-avatar"/> 
                    <div className="input-upload-comment">
                        <form onSubmit={handleSubmit2(onSubmitComment)} className="d-flex justify-content-between align-items-center">
                            <textarea {...register2('comment')} className="form-control" placeholder="Viết bình luận"></textarea>
                            <button type="submit"><i className="fas fa-paper-plane"></i></button>
                        </form>
                    </div>
                </div>
                {comments?.comments.length > 0 ? 
                <div className="comment-content">
                    {comments.comments.map((comment, index) => {
                        return <Comment key={comment._id} blog={blog} indexComment={index} comment={comment} onUpdateComment={onUpdateComment} onDeleteComment={onDeleteComment}/>
                    })}
                </div>
                :
                <div className="mt-3 text-center">Chưa có bình luận nào</div>}
            </div>}

            <Modal show={showUpdateBlog} onHide={handleUpdateClose} size='lg' enforceFocus={false} className="form-modal upload-forum-blog">
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa bài viết</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmitUpdate)}>
                        <div className="mb-3">
                            <label htmlFor="title">Chủ đề</label>
                            <input {...register('title')} type="text" defaultValue={blog?.title} className={`${errors.title ? "border border-danger" : ""} form-control`} id="title"/>
                            <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.title?.message}</p>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description">Nội dung</label>
                            <CKE5Input readOnly={false} type={'forum-blog'} descriptionContent={blog?.description} setDescriptionContent={setDescriptionContent}/>
                            <p className="text-error text-danger ps-3 my-1 fst-italic">{descriptionValidate}</p>
                        </div>
                        <p className={`${updateResult.success ? "text-success" : "text-danger"} text-center fs-6 text-error ps-3 mt-1 mb-3 fst-italic`}>{updateResult.message}</p>
                        <div className="text-center">
                            <button disabled={isSubmitting} type="submit" style={{"width": "100%"}}>Lưu</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            <Modal show={showDeleteBlog} onHide={handleDeleteClose} className="form-modal">
                <Modal.Header className="border-bottom-0" closeButton>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-center">Xác nhận xóa bài viết</p>
                    <div className="d-flex justify-content-center pt-3">
                        <button className="btn btn-danger me-3" onClick={() => onSubmitDelete(blog._id, indexBlog)}>Xóa</button>
                        <button className="btn btn-secondary" onClick={handleDeleteClose}>Hủy</button>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={showUserLike} onHide={handleUserLikeClose} className="form-modal">
                <Modal.Header closeButton>
                    <Modal.Title><i className="fas fa-thumbs-up"></i> {likes?.paging.totalRecords} lượt thích</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showUserLike && likes?.likeUsers.length > 0 ? 
                    <div className="list-like-user">
                        {likes.likeUsers.map((like, index) => {
                            return (
                                <div key={index} className="mb-3 d-flex align-items-center justify-content-between">
                                    <div>
                                        <img src={like.user.avatar.path} width={45} heigt={45} alt="user-avatar" onClick={() => history.push(`/${like.user.slug}`)}/>
                                        <span className="fw-bold ms-3 user-name" onClick={() => history.push(`/${like.user.slug}`)}>{like.user.name}</span>
                                    </div>
                                    <ButtonStatusFriend initFriend={like.friend} toSlugUser={like.user.slug}/>
                                </div>
                            )
                        })} 
                    </div>
                    : 
                    <div className="text-center">Chưa có lượt thích nào</div>}
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ForumBlog;