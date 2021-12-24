import { SET_IS_404, SET_TOKEN, SET_IS_OPEN_SIDE_BAR, SET_IS_LOADING_PAGE, SET_NOTIFY } from "../constants";
import Cookies from "js-cookie";

export const actSetLogin = (payload) => {
    return {
        type: SET_TOKEN,
        payload
    }
}

export const actSetIs404 = (payload) => {
    return {
        type: SET_IS_404,
        payload
    }
}

export const actSetIsLoadingPage = (payload) => {
    return {
        type: SET_IS_LOADING_PAGE,
        payload
    }
}

export const actSetIsOpenSideBar = (payload) => {
    Cookies.set('isOpenSideBar-yb', payload);
    return {
        type: SET_IS_OPEN_SIDE_BAR,
        payload
    }
}

export const setNotify = (payload) => {
    return (dispatch) => {
        dispatch(actSetNotify({...payload, display: true}))
        setTimeout(() => {
            dispatch(actSetNotify({...payload, display: false}))
        }, 1500)
    }
}

export const actSetNotify = (payload) => {
    return {
        type: SET_NOTIFY,
        payload
    }
}

export const redirectToLogin = async (history, dispatch) => {
    await dispatch(actSetLogin(""));
    Cookies.remove('token-yb');
    Cookies.remove('isOpenSideBar-yb');
    history.push('/login_page');
}

export const processErrResponse = async (history, dispatch, response) => {
    switch(response.status) {
        case 401: 
            return redirectToLogin(history, dispatch);
        case 404:
            return dispatch(actSetIs404(true));
        case 500: 
            return dispatch(setNotify({message: "Đã xảy ra lỗi! Vui lòng thử lại sau!", success: false}));
        default: 
            return
    }
}
