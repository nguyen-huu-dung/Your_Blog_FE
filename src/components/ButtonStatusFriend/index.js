import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { callAPI } from "../../apis";
import { processErrResponse, setNotify } from "../../redux/actions/browser.action";
import "./index.scss";


const ButtonStatusFriend = ({initFriend, toSlugUser, indexList, onDeleteList, nameList}) => {
    const { browserState: { token }} = useSelector((state) => {
        return { browserState: state.browserState };
    }) 
    const history = useHistory();
    const dispatch = useDispatch();

    const [ friend, setFriend ] = useState(initFriend);

    // send invite friends
    const handleAddInviteFriend = async () => {
        try {
            await callAPI(`/invite_friends`, 'POST', { token }, null, {toSlugUser});
            const checkFriend = await callAPI(`/friends/status_friend/${toSlugUser}`, 'GET', { token }, null, null);
            setFriend(checkFriend.data.data.friend);
            dispatch(setNotify({message: "Đã gửi lời mời kết bạn", success: true}));
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    // delete invite friend
    const handleCancelInvite = async () => {
        try {
            await callAPI(`/invite_friends/${friend.id_invite}`, 'DELETE', { token }, null, null);
            const checkFriend = await callAPI(`/friends/status_friend/${toSlugUser}`, 'GET', { token }, null, null);
            if(nameList) onDeleteList(nameList, indexList);
            else setFriend(checkFriend.data.data.friend);
            dispatch(setNotify({message: "Đã hủy lời mới", success: true}));
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    // accept invite friend
    const handleAcceptInvite = async () => {
        try {
            await callAPI(`/invite_friends/${friend.id_invite}`, 'PUT', { token }, null, null);
            const checkFriend = await callAPI(`/friends/status_friend/${toSlugUser}`, 'GET', { token }, null, null);
            if(nameList) onDeleteList(nameList, indexList);
            else setFriend(checkFriend.data.data.friend);
            dispatch(setNotify({message: "Thêm bạn thành công", success: true}));
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    // delete friend
    const handleDeleteFriend = async () => {
        try {
            await callAPI(`/friends/${friend.id_friend}`, 'DELETE', { token }, null, null);
            const checkFriend = await callAPI(`/friends/status_friend/${toSlugUser}`, 'GET', { token }, null, null);
            if(nameList) onDeleteList(nameList, indexList);
            else setFriend(checkFriend.data.data.friend);
            dispatch(setNotify({message: "Đã hủy bạn bè", success: true}));
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    return (
        friend?.status_friend === "owner" ? "" : 

        <div className="button-status-friend">
            {friend?.status_friend === "nothing" &&
            <Dropdown align="end">
                <Dropdown.Toggle onClick={handleAddInviteFriend}>
                    <i className="fas fa-user-plus"></i>
                    <span> Thêm bạn bè</span>
                </Dropdown.Toggle>
            </Dropdown>}
            {
                friend?.status_friend === "friend" &&
                <Dropdown align="end">
                    <Dropdown.Toggle>
                        <i className="fas fa-user-check"></i>
                        <span> Bạn bè</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="box-border">
                        <Dropdown.Item onClick={handleDeleteFriend}><span><i className="fas fa-user-times"></i> Hủy bạn bè</span></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            }
            {
                friend?.status_friend === "inviteFrom" &&
                <Dropdown align="end">
                    <Dropdown.Toggle onClick={handleCancelInvite}>
                        <i className="far fa-calendar-times"></i>
                        <span> Hủy lời mời</span>
                    </Dropdown.Toggle>
                </Dropdown>
            }
            {
                friend?.status_friend === "inviteTo" &&
                <Dropdown align="end">
                    <Dropdown.Toggle>
                        <i className="far fa-calendar"></i>
                        <span> Phản hồi</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="box-border">
                        <Dropdown.Item onClick={handleAcceptInvite}><span><i className="far fa-calendar-check"></i> Chấp nhận</span></Dropdown.Item>
                        <Dropdown.Item onClick={handleCancelInvite}><span><i className="far fa-calendar-minus"></i> Xóa lời mời</span></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            }
        </div>
    )
}

export default ButtonStatusFriend;