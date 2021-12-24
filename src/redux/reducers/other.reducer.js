import { SET_INPUT_SEARCH_HOME } from "../constants";

const otherInitState = {
    inputSearchHome : false
}


const handleOtherState = (state =  otherInitState, action) => {
    switch(action.type) {
        case SET_INPUT_SEARCH_HOME: 
            return {
                ...state,
                inputSearchHome: action.payload
            }
        default:
            return state;
    }
}

export default handleOtherState;