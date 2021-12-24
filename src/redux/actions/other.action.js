import { SET_INPUT_SEARCH_HOME } from "../constants"

export const actSetInputSearchHome = (payload) => {
    return {
        type: SET_INPUT_SEARCH_HOME,
        payload: payload
    }
}