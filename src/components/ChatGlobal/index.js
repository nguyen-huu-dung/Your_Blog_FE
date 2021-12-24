import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { connectionOptions } from '../../core/config/socket.config';
import './index.scss';
import TriggerTooltip from '../TriggerToolip';
import ChatRoom from '../ChatRoom';

const ChatGlobal = ({closeChatGlobal}) => {
    let chatGlobalSocketRef = useRef();

    const [ isJoinRoom, setIsJoinRoom ] = useState(false);
    const [ nameRoom, setNameRoom ] = useState("");

    useEffect(() => {
        chatGlobalSocketRef.current = io(`${process.env.REACT_APP_URL_BE}/chatGlobal`, connectionOptions);
        return () => {
            chatGlobalSocketRef.current.disconnect();
        }
    }, [])

    // join room
    const joinRoom = async (nameRoom) => {
        await setNameRoom(nameRoom);
        setIsJoinRoom(true);
    }

    // leave room
    const leaveRoom = () => {
        setIsJoinRoom(false);
    }

    return (
        <div className="chat-global">
            {isJoinRoom ? <ChatRoom nameRoom={nameRoom} leaveRoom={leaveRoom} chatGlobalSocketRef={chatGlobalSocketRef}/>
            :
            <>
                <TriggerTooltip placement="top" contentTooltip="Thoát chat" 
                contentHTML={<i className="fas fa-times close-chat-global" onClick={closeChatGlobal}></i>}/>
            
                <div className="chat-global-container">
                    <h3>Chat trực tuyến</h3>
                    <span className="fst-italic" style={{"fontSize": "14px"}}>Hãy chọn kênh tham gia trò chuyện với mọi người!</span>
                    <div className="chat-global-room mt-4 d-flex flex-column">
                        <button className="chat-room-btn" onClick={() => joinRoom("roomQuestion")}>Trao đổi - Hỏi đáp</button>
                        <button className="chat-room-btn mt-3" onClick={() => joinRoom("roomChat")}>Trò chuyện</button>
                    </div>
                </div>
            </>}
        </div>
    )
}

export default ChatGlobal;