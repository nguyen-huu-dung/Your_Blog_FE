import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { changeTime } from "../../utils/supports";

const Comment = ({comment, blog, indexComment, onUpdateComment, onDeleteComment}) => {
    const { userState: { userInfo }} = useSelector((state) => {
        return { userState: state.userState };
    }) 

    const [ editComment, setEditComment ] = useState(false);
    const [ contentComment, setContentComment ] = useState(`${comment.content}`);

    return (
        <div className="mt-3 d-flex">
            <img src={comment.user?.avatar.path} width={35} height={35} alt="user-avatar"/>
            <div className="ms-2 content-comment">
                <div className={`${editComment && "edit-comment"} comment-content-info`}>
                    <span className="fw-bold">{comment.user.name}</span><br/>
                    {
                        editComment ? 
                        <>
                            <div className="input-edit-comment mt-1 d-flex justify-content-between align-items-center">
                                <textarea className="form-control" defaultValue={comment.content} onChange={(e) => {setContentComment(e.target.value)}}></textarea>
                                {contentComment !== comment.content ?
                                    <i className="fas fa-save" onClick={() => {onUpdateComment(comment._id, contentComment, indexComment); setEditComment(false)}}></i>
                                    :   
                                    <i className="fas fa-save disabled"></i>
                                }
                            </div>
                            <span className="action-comment ps-2" style={{"fontSize": "12px"}} onClick={() => setEditComment(false)}>Hủy</span>
                        </>
                        :
                        <span style={{"whiteSpace": "pre-line"}}>{comment.content}</span>
                    }
                    
                </div>
                <div className="text-secondary mt-1" style={{"fontSize": "12px"}}>
                    {(userInfo?.slug === blog?.user.slug || userInfo?.slug === comment.user.slug) ?
                        <span className="action-comment" onClick={() => onDeleteComment(comment._id, indexComment)}>Xóa</span>
                    :   <span className="action-comment-disabled">Xóa</span>
                    }
                    <span> . </span>
                    {userInfo?.slug === comment.user.slug ?
                        <span className="action-comment" onClick={() => setEditComment(true)}>Chỉnh sửa</span>
                    :   <span className="action-comment-disabled">Chỉnh sửa</span>
                    }
                    <span> . </span>
                    <span><i className="fas fa-globe-asia"></i> {changeTime(comment.created)}</span>
                </div>
            </div>
        </div>
    )
}

export default Comment;