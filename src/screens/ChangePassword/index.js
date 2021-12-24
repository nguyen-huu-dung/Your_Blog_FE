import { useTitle } from "../../core/customHook";
import "./index.scss";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useEffect, useState } from "react";
import { callAPI } from "../../apis";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { actSetIsLoadingPage, processErrResponse, setNotify } from "../../redux/actions/browser.action";

const ChangePassword = () => {
    useTitle("Đổi mật khẩu");
    const { browserState: { token } } = useSelector(state => {
        return { browserState: state.browserState }
    })
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actSetIsLoadingPage(false));
        return () => {
            dispatch(actSetIsLoadingPage(true));
        }
    }, [])

    const [ changePassResult, setChangePassResult ] = useState({message: "", success: true});
    // form validates login
    const validateSchema = yup.object().shape({
        current_password: yup.string().required('Không thể bỏ trống'),
        new_password: yup.string().required('Không thể bỏ trống').matches(new RegExp('^[a-zA-Z0-9]{8,}$'), 'Mật khẩu chỉ bao gồm chữ, số, tối thiếu 8 ký tự'),
        confirm_password: yup.string().oneOf([yup.ref('new_password')], "Nhắc lại mật khẩu không đúng").required('Không thể bỏ trống')
    })
    // use hook form
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(validateSchema)});

    const onSubmit = async (data) => {
        try{
            await callAPI('/users/change_password', 'PUT', {token}, null, data);
            setChangePassResult({message: "Đổi mật khẩu thành công", success: true});
            dispatch(setNotify({message: "Đổi mật khẩu thành công", success: true}));
        }
        catch(err) {
            if(err.response) {
                if(err.response.status === 400) {
                    setChangePassResult({message: err.response.data.message, success: false});
                }
                else {
                    processErrResponse(history, dispatch, err.response);
                }
            }
        }
    }

    return (
        <div className="change-password">
            <h3 className="my-4">Đổi mật khẩu</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
                <div className="mb-3">
                    <label htmlFor="current_password">Mật khẩu hiện tại</label>
                    <input {...register('current_password')} type="password" className={`${errors.current_password ? "border border-danger" : ""} form-control`} id="current_password"/>
                    <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.current_password?.message}</p>
                </div>
                <div className="mb-3">
                    <label htmlFor="new_password">Mật khẩu mới</label>
                    <input {...register('new_password')} type="password" className={`${errors.new_password ? "border border-danger" : ""} form-control`} id="new_password"/>
                    <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.new_password?.message}</p>
                </div>
                <div className="mb-3">
                    <label htmlFor="confirm_password">Nhắc lại mật khẩu</label>
                    <input {...register('confirm_password')} type="password" className={`${errors.confirm_password ? "border border-danger" : ""} form-control`} id="confirm_password"/>
                    <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.confirm_password?.message}</p>
                </div>
                <p className={`${changePassResult.success ? "text-success" : "text-danger"} text-center fs-6 text-error ps-3 mt-1 mb-3 fst-italic`}>{changePassResult.message}</p>
                <button disabled={isSubmitting} type="submit">Đổi mật khẩu</button>
            </form>
        </div>
    )
}

export default ChangePassword;