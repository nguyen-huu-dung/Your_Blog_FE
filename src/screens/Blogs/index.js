import { Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTitle } from '../../core/customHook';
import './index.scss';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { callAPI } from '../../apis';
import { actSetIsLoadingPage, processErrResponse, setNotify } from '../../redux/actions/browser.action';
import { useHistory } from 'react-router';
import { actSetUserBlogs } from '../../redux/actions/user.action';
import ListViewBlog from '../../components/ListViewBlog';
import { removeVietnameseTones } from '../../utils/supports';
import CKE5Input from '../../components/CKEditer5';

const Blogs = () => {
    useTitle("Bài viết cá nhân");
    const { browserState: { token }, userState: { blogs }} = useSelector(state => {
        return { browserState: state.browserState, userState: state.userState }
    })
    const history = useHistory();
    const dispatch = useDispatch();

    // process blog filter
    const [ filterBlogs, setFilterBlogs ] = useState([]);
    const [ isSearch, setIsSearch ] = useState(false);

    const processSearchBlog = (keyword) => {
        if(keyword === "") {
            setFilterBlogs(blogs);
            setIsSearch(false);
        }
        else {
            setIsSearch(true);
            const formatKeyword = removeVietnameseTones(keyword.toLowerCase());
            const filter = blogs.filter((blog) => {
                const formatTitle = removeVietnameseTones(blog.title.toLowerCase());
                return formatTitle.includes(formatKeyword);
            })
            setFilterBlogs(filter);
        }
    }

    const getBlogs = async () => {
        try {
            const getData = await callAPI('/blogs', "GET", { token }, null, null);
            await dispatch(actSetUserBlogs(getData.data.data.blogs));
            await setFilterBlogs(getData.data.data.blogs);
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

    useEffect(() => {
        getBlogs();
        return () => {
            dispatch(actSetIsLoadingPage(true));
        }
    }, []);


    // add blog
    const [showAddBlog, setShowAddBlog] = useState(false);
    const [ addResult, setAddResult ] = useState({message: "", success: true});
    const [ descriptionContent, setDescriptionContent ] = useState("");
    const [ descriptionValidate, setDescriptionValidate ] = useState("");
    // form validates upload
    const validateSchema = yup.object().shape({
        title: yup.string().min(4, "Tối thiểu 4 ký tự").max(200, 'Tối đa 200 kí tự').required('Không thể bỏ trống'),
        status: yup.string()
    })

    // use hook form
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(validateSchema)});
    const handleClose = () => setShowAddBlog(false);
    const handleShow = () => {
        setShowAddBlog(true);
        setAddResult({message: "", success: true});
    };

    const onSubmit = async (data) => {
        if(descriptionContent === "") return await setDescriptionValidate('Không thể bỏ trống');
        if(descriptionContent.length < 20) return await setDescriptionValidate('Tối thiểu 20 kí tự');
        setDescriptionValidate("");
        try{
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', descriptionContent);
            formData.append('status', data.status);
            formData.append('upload', data.image[0]);
            const result = await callAPI('/blogs', 'POST', { token, 'Content-Type': 'multipart/form-data' }, null, formData);
            history.push(`/blogs_management/${result.data.data.slug}`);
            dispatch(setNotify({message: "Tạo bài blog mới thành công", success: true}))
        }
        catch(err) {
            if(err.response) {
                if(err.response.status === 400)  setAddResult({message: err.response.data.message, success: false});
                else processErrResponse(history, dispatch, err.response);
            }
        }
    }

    return (
        <div className="blog-page">
            <div className="list-blog mt-5">
                <div className="mb-2 d-flex justify-content-between align-items-center">
                    <div className="d-flex search-blog" style={{"width": "30%"}}>
                        <input className="form-control" placeholder="Tìm kiếm" onChange={(e) => processSearchBlog(e.target.value)}></input>
                    </div>
                    <h3>Bài viết cá nhân</h3>
                    <div style={{"width": "30%"}}>
                        <button className="add-blog" onClick={handleShow}>
                            Tạo bài blog mới
                        </button>
                    </div>
                </div>
                <hr className="mx-auto"/>
                {filterBlogs.length > 0 ? <ListViewBlog blogs={filterBlogs} isBlogManagement={true}/> 
                : 
                isSearch ? <p className="text-center fst-italic">Không tìm thấy bài blog phù hợp!</p>
                : <p className="text-center fst-italic">Chưa có bài blog cá nhân của riêng bạn! Hãy tạo mới ngay!</p>}
            </div>
            <Modal show={showAddBlog} onHide={handleClose} size="lg" enforceFocus={false} className="form-modal" dialogClassName="min-width-900">
                <Modal.Header closeButton>
                    <Modal.Title>Tạo bài blog mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label htmlFor="title">Chủ đề</label>
                            <input {...register('title')} type="text" className={`${errors.title ? "border border-danger" : ""} form-control`} id="title"/>
                            <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.title?.message}</p>
                        </div>
                        <div className="mb-3">
                            <select {...register('status')} className="form-select" aria-label="Default select example" defaultValue="public">
                                <option value="public">Công khai</option>
                                <option value="friend">Bạn bè</option>
                                <option value="private">Riêng tư</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image">Ảnh bìa</label>
                            <input {...register('image')} type="file" accept="image/*" className="ms-2" id="image"></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description">Nội dung</label>
                            <CKE5Input readOnly={false} type={'blog'} descriptionContent={descriptionContent} setDescriptionContent={setDescriptionContent}/>
                            <p className="text-error text-danger ps-3 my-1 fst-italic">{descriptionValidate}</p>
                        </div>
                        <p className={`${addResult.success ? "text-success" : "text-danger"} text-center fs-6 text-error ps-3 mt-1 mb-3 fst-italic`}>{addResult.message}</p>
                        <div className="text-center">
                            <button disabled={isSubmitting} type="submit">Tạo</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Blogs;