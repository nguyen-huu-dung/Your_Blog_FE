import { SET_USER_BLOGS, SET_USER_INFO } from "../constants";

const userInitState = {
    userInfo: {},
    blogs: []
}


const handleUserState = (state =  userInitState, action) => {
    switch(action.type) {
        case SET_USER_INFO: 
            return {
                ...state,
                userInfo: action.payload
            }
        case SET_USER_BLOGS:
            return {
                ...state,
                blogs: action.payload
            }
        default:
            return state;
    }
}

export default handleUserState;