import { combineReducers } from "redux";
import handleBrowserState from "./browser.reducer";
import handleOtherState from "./other.reducer";
import handleUserState from "./user.reducer";

export default combineReducers({
    browserState: handleBrowserState,
    userState: handleUserState,
    otherState: handleOtherState
})