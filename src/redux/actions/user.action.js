import { SET_USER_BLOGS, SET_USER_INFO } from "../constants";


export const actSetUserInfo = (payload) => {
    return {
        type: SET_USER_INFO,
        payload
    }
}

export const actSetUserBlogs = (payload) => {
    return {
        type: SET_USER_BLOGS,
        payload
    }
}
