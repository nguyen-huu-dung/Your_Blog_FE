import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { callAPI } from '../../apis';
import { changeTime } from '../../utils/supports';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import './index.scss';
import { useTitle } from '../../core/customHook';
import { actSetIs404, actSetIsLoadingPage, processErrResponse, setNotify } from '../../redux/actions/browser.action';
import Custom404 from '../404';
import CKE5Input from '../../components/CKEditer5';

const DetailsBlog = () => {
    const { slugUser, slugBlog } = useParams();
    const { browserState: { token, is404}, userState: { userInfo }} = useSelector(state => {
        return { browserState: state.browserState, userState: state.userState }
    })
    const history = useHistory();
    const dispatch = useDispatch();
    const [ blog, setBlog ] = useState('');
    const [ descriptionContent, setDescriptionContent ] = useState("");
    useTitle(blog?.title);
    const getBlog = async (slug_blog) => {
        try{
            const result = await callAPI(`/blogs/${slug_blog}`, 'GET', { token }, { user: slugUser }, null);
            setBlog(result.data.data);
            dispatch(actSetIs404(false));
        }
        catch(err){
            if(err.response) {
                processErrResponse(history, dispatch, err.response);
            }
        }
        finally {
            dispatch(actSetIsLoadingPage(false));
        }
    }

    useEffect(() => {
        getBlog(slugBlog);
        return () => {
            dispatch(actSetIsLoadingPage(true));
        }
    }, []);

    const [showUpdateBlog, setShowUpdateBlog] = useState(false);
    const [ updateResult, setUpdateResult ] = useState({message: "", success: true});
    const [ descriptionValidate, setDescriptionValidate ] = useState("");
    const [showDeleteBlog, setShowDeleteBlog] = useState(false);
    // form validates update
    const validateSchema = yup.object().shape({
        title: yup.string().min(4, "Tối thiểu 4 ký tự").max(200, 'Tối đa 200 kí tự').required('Không thể bỏ trống'),
        status: yup.string()
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

    const handleDeleteClose = () => setShowDeleteBlog(false);
    const handleDeleteShow = () =>  setShowDeleteBlog(true);

    const onSubmitUpdate = async (data) => {
        if(descriptionContent === "") return await setDescriptionValidate('Không thể bỏ trống');
        if(descriptionContent.length < 20) return await setDescriptionValidate('Tối thiểu 20 kí tự');
        setDescriptionValidate("");
        try{
            const resultUpdate = await callAPI(`/blogs/${slugBlog}`, 'PUT', { token }, null, {...data, description: descriptionContent});
            history.replace(`/blogs_management/${resultUpdate.data.data.slug}`);
            setBlog(resultUpdate.data.data);
            handleUpdateClose();
            dispatch(setNotify({message: "Cập nhật bài blog thành công", success: true}));
        }
        catch(err) {
            console.log(err);
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
    const onSubmitDelete = async () => {
        try{
            await callAPI(`/blogs/${slugBlog}`, 'DELETE', { token }, null, null);
            history.push('/blogs_management');
            dispatch(setNotify({message: "Đã xóa bài blog", success: true}))
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    // update image
    const submitUpdateImage = async (image) => {
        try {
            if(image) {
                const formData = new FormData();
                formData.append('upload', image);
                const result = await callAPI(`/blogs/change_image/${slugBlog}`, 'PUT', { token, 'Content-Type': 'multipart/form-data' }, null, formData);
                await setBlog({...blog, image: result.data.data.image_update});
                dispatch(setNotify({message: "Cập nhật ảnh thành công", success: true}));
            }
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    // render
    if(is404) return <Custom404/>;

    return (
        blog &&
        <div className="view-details-blog">
            <div className="mt-5 p-4">
                <div className="title">
                    <div className="details-blog-info">
                        <h3>{blog?.title}</h3>
                        <span className="fs-6 fst-italic">{blog?.status === 'public' ? "Công khai" : blog?.status === 'friend' ? "Bạn bè" : "Riêng tư"}</span><br/>
                        <span>Tác giả: {blog?.user?.name}</span><br/>
                        <span>Ngày đăng: {changeTime(blog?.created)}</span><br/>
                        {blog?.updated && <span>Ngày chỉnh sửa gần nhất: {changeTime(blog?.updated)}</span>}
                        {
                            blog?.user?.slug === userInfo.slug ?
                            slugUser ? 
                                <button className="update-blog-btn mt-3" onClick={() => history.push(`/blogs_management/${slugBlog}`)}>Cập nhật bài blog</button>
                            :
                            <div className="action-blog mt-2">
                            <i className="fas fa-edit" data-bs-toggle="tooltip" data-bs-placement="right" title="Chỉnh sửa" onClick={handleUpdateShow}></i>
                            <i className="fas fa-trash-alt" data-bs-toggle="tooltip" data-bs-placement="right" title="Xóa" onClick={handleDeleteShow}></i>
                            </div>
                            :
                            <></>
                        }
                    </div>
                    <div className="image-upload">
                        {
                            slugUser ?
                            <img src={ blog?.image} className="card-img-top" alt="blog"></img>
                            :
                            <> 
                                <label htmlFor="file-input">
                                    <OverlayTrigger
                                        key={'bottom'}
                                        placement={'bottom'}
                                        overlay={
                                            <Tooltip>
                                            Đổi image
                                            </Tooltip>
                                        }
                                        >
                                        <img src={ blog?.image} className="card-img-top" alt="blog"></img>
                                    </OverlayTrigger>
                                </label>
                                <input id="file-input" type="file" name="upload" onChange={(e) => submitUpdateImage(e.target.files[0])}/>
                            </>
                        }
                    </div>
                </div>
                <div className="mt-5 mb-3 text-center details-blog-description">
                    <div className='mb-1'><span>Nội dung</span></div>
                    <CKE5Input readOnly={true} type={'blog'} descriptionContent={blog?.description} setDescriptionContent={setDescriptionContent}/>
                </div>
            </div>
            <Modal show={showUpdateBlog} onHide={handleUpdateClose} size="lg" enforceFocus={false} className="form-modal" dialogClassName="min-width-900">
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật thông tin bài blog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmitUpdate)}>
                        <div className="mb-3">
                            <label htmlFor="title">Chủ đề</label>
                            <input {...register('title')} type="text" defaultValue={blog?.title} className={`${errors.title ? "border border-danger" : ""} form-control`} id="title"/>
                            <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.title?.message}</p>
                        </div>
                        <div className="mb-3">
                            <select {...register('status')} defaultValue={blog?.status}  className="form-select" aria-label="Default select example">
                                <option value="public">Công khai</option>
                                <option value="friend">Bạn bè</option>
                                <option value="private">Riêng tư</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description">Nội dung</label>
                            <CKE5Input readOnly={false} type={'blog'} descriptionContent={descriptionContent} setDescriptionContent={setDescriptionContent}/>
                            <p className="text-error text-danger ps-3 my-1 fst-italic">{descriptionValidate}</p>
                        </div>
                        <p className={`${updateResult.success ? "text-success" : "text-danger"} text-center fs-6 text-error ps-3 mt-1 mb-3 fst-italic`}>{updateResult.message}</p>
                        <div className="text-center">
                            <button disabled={isSubmitting} type="submit">Cập nhật</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            <Modal show={showDeleteBlog} onHide={handleDeleteClose} className="form-modal">
                <Modal.Header className="border-bottom-0" closeButton>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-center">Xác nhận xóa bài blog "{blog?.title}"</p>
                    <div className="d-flex justify-content-center pt-3">
                        <button className="btn btn-danger me-3" onClick={onSubmitDelete}>Xóa</button>
                        <button className="btn btn-secondary" onClick={handleDeleteClose}>Hủy</button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DetailsBlog;
