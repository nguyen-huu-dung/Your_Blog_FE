import { useTitle } from "../../core/customHook";
import "./index.scss";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useEffect, useState } from "react";
import { callAPI } from '../../apis';
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { actSetIsLoadingPage, setNotify } from "../../redux/actions/browser.action";


const RegisterPage = () => {
    useTitle("Đăng ký");
    const history = useHistory();
    const dispatch = useDispatch();
    const { browserState: { token }} = useSelector(state => {
        return { browserState: state.browserState}
    })
    const [ registerResult, setRegisterResult ] = useState({message: "", success: true});
    // form validates login
    const validateSchema = yup.object().shape({
        username: yup.string().required('Không thể bỏ trống').matches(new RegExp('^[a-zA-Z0-9]{8,}$'), 'Tên đăng nhập chỉ bao gồm chữ, số, tối thiếu 8 ký tự'),
        name: yup.string().required('Không thể bỏ trống').matches(new RegExp('^[a-zA-Z" "]|[à-ú]|[À-Ú]{4,50}$'), 'Tên người dùng chỉ bao gồm chữ, kí tự khoảng trắng, từ 4 - 50 ký tự'),
        email: yup.string().email('Email không hợp lệ').required('Không thể bỏ trống'),
        password: yup.string().required('Không thể bỏ trống').matches(new RegExp('^[a-zA-Z0-9]{8,}$'), 'Mật khẩu chỉ bao gồm chữ, số, tối thiếu 8 ký tự'),
        password_confirm: yup.string().oneOf([yup.ref('password')], "Nhắc lại mật khẩu không đúng").required('Không thể bỏ trống')
    })
    // use hook form
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(validateSchema)});

    useEffect(() => {
        dispatch(actSetIsLoadingPage(false));
        if(token) history.push('/');
        return () => {
            dispatch(actSetIsLoadingPage(true));
        }
    }, [])

    const onSubmit = async (data) => {
        try {
            await callAPI("/users", "POST", null, null, data);
            setRegisterResult({message: "Tạo tài khoản thành công", success: true});
            history.push('/login_page');
            dispatch(setNotify({message: "Tạo tài khoản thành công", success: true}));
        }
        catch(err) {
            if(err.response) setRegisterResult({message: err.response.data.message, success: false});
        }
    }

    return(
        <div className="register row">
            <div className="left-page col-7">
                <h1 className="text-format-head" data-head="Your Blog">Your Blog</h1>
                <p className="text-format" data-p="Nơi chia sẻ các bài blog, lưu trữ các bài blog cho riêng bạn">Nơi chia sẻ các bài blog, lưu trữ các bài blog cho riêng bạn</p>
                <img src={process.env.REACT_APP_URL_IMAGE_DEFAULT} alt="register" width={550} height={500}></img>
            </div>
            <div className="right-page col-5 d-flex align-items-center flex-column">
                <h3 className="mb-4">Tạo tài khoản</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
                    <div className="form-floating mb-4">
                        <input {...register('username')} type="text" className={`${errors.username ? "border border-danger" : ""} form-control`} id="username" placeholder="Username"/>
                        <label htmlFor="username">Tên đăng nhập</label>
                        <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.username?.message}</p>
                    </div>
                    <div className="form-floating mb-4">
                        <input {...register('name')} type="text" className={`${errors.name ? "border border-danger" : ""} form-control`} id="name" placeholder="Name"/>
                        <label htmlFor="name">Tên người dùng</label>
                        <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.name?.message}</p>
                    </div>
                    <div className="form-floating mb-4">
                        <input {...register('email')} type="email" className={`${errors.email ? "border border-danger" : ""} form-control`} id="email" placeholder="Email"/>
                        <label htmlFor="email">Email</label>
                        <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.email?.message}</p>
                    </div>
                    <div className="form-floating mb-4">
                        <input {...register('password')} type="password" className={`${errors.password ? "border border-danger" : ""} form-control`} id="password" placeholder="Password"/>
                        <label htmlFor="password">Mật khẩu</label>
                        <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.password?.message}</p>
                    </div>
                    <div className="form-floating mb-4">
                        <input {...register('password_confirm')} type="password" className={`${errors.password_confirm ? "border border-danger" : ""} form-control`} id="password_confirm" placeholder="Repeat password"/>
                        <label htmlFor="password_confirm">Nhắc lại mật khẩu</label>
                        <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.password_confirm?.message}</p>
                    </div>
                    <p className={`${registerResult.success ? "text-success" : "text-danger"} text-center fs-6 text-error ps-3 mt-1 mb-3 fst-italic`}>{registerResult.message}</p>
                    <button disabled={isSubmitting} type="submit">Đăng ký</button>
                </form>
                <Link to="/login_page" className="text-decoration-none">
                    <span className="fs-6 text-white">Đăng nhập ngay <i className="fas fa-long-arrow-alt-right align-middle"></i></span>
                </Link>
            </div>
        </div>
    )
}

export default RegisterPage;