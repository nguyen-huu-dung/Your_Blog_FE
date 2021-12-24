import { useTitle } from "../../core/customHook";
import "./index.scss";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useEffect, useState } from "react";
import { callAPI } from "../../apis";
import { useDispatch, useSelector } from "react-redux";
import { actSetIsLoadingPage, actSetIsOpenSideBar, actSetLogin, setNotify } from "../../redux/actions/browser.action";
import { useHistory } from "react-router";
import Cookies from 'js-cookie';


const LoginPage = () => {
    useTitle("Đăng nhập");
    const history = useHistory();
    const dispatch = useDispatch();
    const { browserState: { token }} = useSelector(state => {
        return { browserState: state.browserState}
    })
    const [ loginResult, setLoginResult ] = useState({message: "", success: true});
    // form validates login
    const validateSchema = yup.object().shape({
        username: yup.string().required('Không thể bỏ trống'),
        password: yup.string().required('Không thể bỏ trống')
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
        try{
            const loginResult = await callAPI("/login", "POST", null, null, data);
            await dispatch(actSetLogin(loginResult.data.data.token));
            Cookies.set('token-yb', loginResult.data.data.token, { expires: 1 });
            await dispatch(actSetIsOpenSideBar(true));
            history.push('/');
            dispatch(setNotify({message: "Đăng nhập thành công", success: true}));
        }
        catch(err) {
            if(err.response?.status === 401 || err.response?.status === 400) setLoginResult({message: err.response.data.message, success: false});
        }
    }

    return(
        <div className="login row">
            <div className="left-page col-7">
                <h1 className="text-format-head" data-head="Your Blog">Your Blog</h1>
                <p className="text-format" data-p="Nơi chia sẻ các bài blog, lưu trữ các bài blog cho riêng bạn">Nơi chia sẻ các bài blog, lưu trữ các bài blog cho riêng bạn</p>
                <img src={process.env.REACT_APP_URL_IMAGE_DEFAULT} alt="login" width={550} height={500}></img>
            </div>
            <div className="right-page col-5 d-flex align-items-center flex-column">
                <h3 className="mb-4">Đăng nhập</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
                    <div className="form-floating mb-4">
                        <input {...register('username')} type="text" className={`${errors.username ? "border border-danger" : ""} form-control`} id="username" placeholder="Username"/>
                        <label htmlFor="username">Tên đăng nhập</label>
                        <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.username?.message}</p>
                    </div>
                    <div className="form-floating mb-4">
                        <input {...register('password')} type="password" className={`${errors.password ? "border border-danger" : ""} form-control`} id="password" placeholder="Password"/>
                        <label htmlFor="password">Mật khẩu</label>
                        <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.password?.message}</p>
                    </div>
                    {!loginResult.success && <p className="text-error text-danger text-center fs-6 ps-3 mt-1 mb-3 fst-italic">{loginResult.message}</p>}
                    <button disabled={isSubmitting} type="submit">Đăng nhập</button>
                </form>
                <Link to="/register_page" className="text-decoration-none">
                    <span className="fs-6 text-white">Tạo tài khoản mới <i className="fas fa-long-arrow-alt-right align-middle"></i></span>
                </Link>
            </div>
        </div>
    )
}

export default LoginPage;