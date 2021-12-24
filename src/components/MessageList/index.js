import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import TriggerTooltip from '../TriggerToolip';
import './index.scss';

const MessageList = ({listMessages, messageEndRef, isNewMessage, scrollToBottom}) => { 
    const history = useHistory();

    
    useEffect(() => {
        scrollToBottom('auto');
    }, [])

    return (
        <div className="message-list w-100 h-100">
            {
                listMessages.length > 0 ?
                <>
                    {listMessages.map((message) => 
                        <div key={message._id} className={message.type}>
                            <div className="message-container">
                                {message.type === "receiveMessage" &&
                                <TriggerTooltip placement="left" contentTooltip={message.user.name} 
                                contentHTML={<img src={message.user.avatar.path} alt="" onClick={() => history.push(`/${message.user.slug}`)}/>}/>}
                                <div className="message-content">
                                    {message.message}
                                </div>
                            </div>
                        </div>
                    )}
                    {isNewMessage && listMessages.length > 6 && <div className="have-new-message" onClick={() => scrollToBottom('smooth')}><i className="fas fa-angle-double-down"></i> Tin nhắn mới</div>}
                    <div ref={messageEndRef} />
                </>
                :
                <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                    <span>Chưa có tin nhắn nào</span>
                </div>
            }
        </div>
    )
}

export default MessageList;