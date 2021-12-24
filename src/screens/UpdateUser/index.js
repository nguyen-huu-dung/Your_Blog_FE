import { useTitle } from "../../core/customHook";
import "./index.scss";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { actSetIsLoadingPage, actSetLogin, processErrResponse, setNotify } from "../../redux/actions/browser.action";
import { callAPI } from "../../apis";
import { actSetUserInfo } from "../../redux/actions/user.action";
import TriggerTooltip from "../../components/TriggerToolip";
import Cookies from 'js-cookie';


const UpdateUser = () => {
    useTitle("Cập nhật thông tin");
    const { browserState: { token }, userState: { userInfo } } = useSelector(state => {
        return { browserState: state.browserState, userState: state.userState };
    })
    const history = useHistory();
    const dispatch = useDispatch();
    const [ loadData, setLoadData ] = useState(false);

    const getUser = async () => {
        try {
            const userInfo = await callAPI('/users/user_info', "GET", {token}, null, null);;
            await dispatch(actSetUserInfo(userInfo.data.data));
            setLoadData(true);
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
        getUser();
        return () => {
            dispatch(actSetIsLoadingPage(true));
        }
    }, [])

    const [ updateUserResult, setUpdateUserResult ] = useState({message: "", success: true});
    // form validates login
    const validateSchema = yup.object().shape({
        name: yup.string().required('Không thể bỏ trống').matches(new RegExp('^[a-zA-Z" "]|[à-ú]|[À-Ú]{4,50}$'), 'Tên người dùng chỉ bao gồm chữ, kí tự khoảng trắng, từ 4 - 50 ký tự'),
        email: yup.string().email('Email không hợp lệ').required('Không thể bỏ trống'),
        phone: yup.string().notRequired(),
        address: yup.string().notRequired(),
        country: yup.string().notRequired(),
    })
    // use hook form
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset} = useForm({resolver: yupResolver(validateSchema)});

    const onSubmit = async (data) => {
        try{
            const resultUpdate = await callAPI('/users/user_info', 'PUT', { token }, null, data);
            setUpdateUserResult({message: "Cập nhật thông tin thành công", success: true});
            await dispatch(actSetLogin(resultUpdate.data.data.token));
            Cookies.set('token-yb', resultUpdate.data.data.token, { expires: 1 });
            await dispatch(actSetUserInfo(resultUpdate.data.data.user));
            reset();
            dispatch(setNotify({message: "Cập nhật thông tin thành công", success: true}));
        }
        catch(err) {
            if(err.response) {
                if(err.response.status === 400) {
                    setUpdateUserResult({message: err.response.data.message, success: false});
                }
                else {
                    processErrResponse(history, dispatch, err.response);
                }
            }
        }
    }

     // update avatar
     const submitUpdateAvatar = async (image) => {
        try {
            if(image) {
                const formData = new FormData();
                formData.append('upload', image);
                const result = await callAPI(`/users/change_avatar`, 'PUT', { token, 'Content-Type': 'multipart/form-data' }, null, formData);
                await dispatch(actSetUserInfo({...userInfo, avatar: result.data.data.avatar_update}));
                dispatch(setNotify({message: "Cập nhật avatar thành công", success: true}));
            }
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    return (
        loadData &&
        <div className={`update-user-info`}>
            <h3 className="my-4">Cập nhật thông tin cá nhân</h3>
            <div className="update-user d-flex">

                <div className="image-upload">
                    <label htmlFor="file-input">
                    <TriggerTooltip placement="bottom" contentTooltip="Đổi avatar" contentHTML={<img src={userInfo?.avatar} alt="user-avatar"></img>}/>
                    </label>
                    <input id="file-input" type="file" name="upload" onChange={(e) => submitUpdateAvatar(e.target.files[0])}/>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
                    <div className="mb-3">
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input type="text" className={`form-control`} id="username" defaultValue={userInfo?.username} disabled/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="slug">Slug</label>
                        <input type="text" className={`form-control`} id="slug" defaultValue={userInfo?.slug} disabled/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name">Tên người dùng</label>
                        <input {...register('name')} type="text" className={`${errors.name ? "border border-danger" : ""} form-control`} defaultValue={userInfo?.name} id="name"/>
                        <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.name?.message}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">Email</label>
                        <input {...register('email')} type="email" className={`${errors.email ? "border border-danger" : ""} form-control`} defaultValue={userInfo?.email} id="email"/>
                        <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.email?.message}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone">Số điện thoại</label>
                        <input {...register('phone')} type="text" className={`${errors.phone ? "border border-danger" : ""} form-control`} defaultValue={userInfo?.phone} id="phone"/>
                        <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.phone?.message}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address">Địa chỉ</label>
                        <input {...register('address')} type="text" className={`${errors.address ? "border border-danger" : ""} form-control`} defaultValue={userInfo?.address} id="address"/>
                        <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.address?.message}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="country">Quốc gia</label>
                        <input {...register('country')} type="text" className={`${errors.country ? "border border-danger" : ""} form-control`} defaultValue={userInfo?.country} id="country"/>
                        <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.country?.message}</p>
                    </div>
                    <p className={`${updateUserResult.success ? "text-success" : "text-danger"} text-center fs-6 text-error ps-3 mt-1 mb-3 fst-italic`}>{updateUserResult.message}</p>
                    <button disabled={isSubmitting} type="submit">Cập nhật thông tin</button>
                </form>
            </div>
        </div>
    )
}

export default UpdateUser;