import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { processErrResponse } from '../../redux/actions/browser.action';
import MessageList from '../MessageList';
import TriggerTooltip from '../TriggerToolip';
import { callAPI } from '../../apis';
import './index.scss';

const ChatRoom = ({nameRoom, leaveRoom, chatGlobalSocketRef}) => {

    const { browserState: { token }, userState: { userInfo } } = useSelector(state => {
        return { browserState: state.browserState , userState: state.userState};
    })
    const history = useHistory();
    const dispatch = useDispatch();
    const [ isLoading, setIsLoading ] = useState(true);

    // process scroll chat messages
    const divMessages = useRef(null);
    const messageEndRef = useRef();
    const scrollToBottom = (typeScroll) => {
        messageEndRef.current?.scrollIntoView({ behavior: typeScroll });
        setIsNewMessage(false);
    }

    const checkScrollBottom = () => {
        if(divMessages.current === null) return true;
        if(divMessages.current.scrollTop + divMessages.current.clientHeight >= divMessages.current.scrollHeight - 5) return true;
        return false;
    }

    const onScroll = () => {
        const checkBottom = checkScrollBottom();
        if(checkBottom) setIsNewMessage(false);
    }

    const [ messages, setMessages] = useState([]);
    const [ isNewMessage, setIsNewMessage ] = useState(false);
    const [ sumUsersRoom, setSumUsersRoom ] = useState(1);

    // get data
    const getMessages = async () => {
        try{
            const result = await callAPI('/chat_globals', 'GET', { token }, { roomName: nameRoom }, null);
            await setMessages(result.data.data.messages);
            setIsLoading(false);
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }
    
    useEffect(() => {
        getMessages();
        chatGlobalSocketRef.current.on(`sum-user-${nameRoom}`, (arg) => setSumUsersRoom(arg));
        chatGlobalSocketRef.current.emit(`join-${nameRoom}`);
        // listen message
        chatGlobalSocketRef.current.on(`receiveMessage-${nameRoom}`, async (arg) => {
            const checkBottom = checkScrollBottom();
            if(arg.user.slug === userInfo.slug) {
                await setMessages(messages => [...messages, {...arg, type: "sendMessage"}]);
            }
            else {
                await setMessages(messages => [...messages, {...arg, type: "receiveMessage"}]);
            }
            if(checkBottom) scrollToBottom('auto');
            else {
                setIsNewMessage(true);
            }
        })
        return () => {
            chatGlobalSocketRef.current.emit(`leave-${nameRoom}`);
        }
    }, [])

    const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm();

    // upload message
    const onSubmitMessage = async (data) => {
        try {
            if(data.message !== "") {
                const result = await callAPI('/chat_globals', 'POST', { token }, { roomName: nameRoom }, {message: data.message});
                chatGlobalSocketRef.current.emit(`sendMessage-${nameRoom}`, result.data.data);
                setMessages([...messages, result.data.data]);
                scrollToBottom('auto');
                reset();
            }
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    return (
        <div className="chat-room">
            <TriggerTooltip placement="top" contentTooltip="Thoát phòng" 
                contentHTML={<i className="fas fa-arrow-left close-chat-global" onClick={leaveRoom}></i>}/>
            
            <div className="title-chat-room">
                <h4>{nameRoom === "roomQuestion" ? "Trao đổi - Hỏi đáp" : "Trò chuyện"}</h4>
                <span style={{'fontSize': '14px'}}>Bạn và {sumUsersRoom - 1} người đang tham gia phòng</span>
            </div>
            <div ref={divMessages} onScroll={onScroll} className="messages-chat-room">
                {isLoading ? 
                <div className="d-flex w-100 h-100 justify-content-center align-items-center">
                    <div className="spinner-border" role="status" style={{"color": "#3d41bed4"}}></div>
                </div>
                :
                <MessageList listMessages={messages} messageEndRef={messageEndRef} isNewMessage={isNewMessage} scrollToBottom={scrollToBottom}/>
                }
            </div>
            <div className="input-chat-room">
                <form onSubmit={handleSubmit(onSubmitMessage)}>
                    <input {...register('message')} className="form-control" defaultValue={""} placeholder="Gửi tin nhắn..." autoComplete="off"></input>
                    <button disabled={isSubmitting} className="send-chat-room-btn"><i className="fas fa-paper-plane"></i></button>
                </form>
            </div>
        </div>
    )
}

export default ChatRoom;