import { SET_IS_404, SET_IS_LOADING_PAGE, SET_IS_OPEN_SIDE_BAR, SET_NOTIFY, SET_TOKEN } from "../constants";
import Cookies from 'js-cookie';

const browserInitState = {
    token: Cookies.get('token-yb') || false,
    is404: false,
    isLoadingPage: true,
    isOpenSideBar: Cookies.get('isOpenSideBar-yb') ? Cookies.get('isOpenSideBar-yb') === 'false' ? false : true : true,
    notify: {
        message: "",
        success: true,
        display: false
    }
}


const handleBrowserState = (state =  browserInitState, action) => {
    switch(action.type) {
        case SET_TOKEN: 
            return {
                ...state,
                token: action.payload
            }
        case SET_IS_404: 
            return {
                ...state,
                is404: action.payload
            }
        case SET_IS_LOADING_PAGE:
            return {
                ...state,
                isLoadingPage: action.payload
            }
        case SET_IS_OPEN_SIDE_BAR:
            return {
                ...state,
                isOpenSideBar: action.payload
            }
        case SET_NOTIFY: 
            return {
                ...state,
                notify: action.payload
            }
        default:
            return state;
    }
}

export default handleBrowserState;