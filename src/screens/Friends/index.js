import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useTitle } from '../../core/customHook';
import { Tab, Tabs } from 'react-bootstrap';
import './index.scss';
import { useEffect, useState } from 'react';
import { actSetIsLoadingPage, processErrResponse } from '../../redux/actions/browser.action';
import { useHistory, useParams } from 'react-router';
import { callAPI } from '../../apis';
import { changeTime } from '../../utils/supports';
import ButtonStatusFriend from '../../components/ButtonStatusFriend';

const Friends = () => {
    useTitle("Bạn bè");
    const { browserState: { token } } = useSelector(state => {
        return { browserState: state.browserState }
    })
    const history = useHistory();
    const dispatch = useDispatch();

    const [ isLoading, setIsLoading ] = useState(true);

    const [ key, setKey ] = useState(useQuery().get('key') || 'list');
    const [ friends, setFriends ] = useState([]);
    const [ inviteFroms, setInviteFroms ] = useState([]);
    const [ inviteTos, setInviteTos ] = useState([]);

    const getData = async () => {
        setIsLoading(true);
        try {
            switch(key) {
                case "list": 
                    {
                        history.replace(`/friends?key=list`);
                        const result = await callAPI('/friends', 'GET', { token }, null, null);
                        setFriends(result.data.data.friends);
                        return
                    }
                case "invite_request": 
                    {
                        history.replace('/friends?key=invite_request');
                        const result = await callAPI('/invite_friends', 'GET', { token }, { type: 'to' }, null);
                        setInviteTos(result.data.data.invites);
                        return
                    }
                case "invite_send": 
                    {
                        history.replace('/friends?key=invite_send');
                        const result = await callAPI('/invite_friends', 'GET', { token }, { type: 'from' }, null);
                        setInviteFroms(result.data.data.invites);
                        return
                    }
                default: return
            }
        }
        catch(err) {
            if(err.response) {
                processErrResponse(history, dispatch, err.response);
            }
        }
        finally {
            setIsLoading(false);
            dispatch(actSetIsLoadingPage(false));
        }
    }

    useEffect(() => {
        getData();
    }, [key])

    useEffect(() => {
        return () => {
            dispatch(actSetIsLoadingPage(true));
        }
    }, [])

    const onDeleteList = (nameList, indexList) => {
        switch(nameList) {
            case 'list':
                {
                    setFriends([...friends.slice(0, indexList), ...friends.slice(indexList + 1)]);
                    return
                }
            case 'invite_request':
                {
                    setInviteTos([...inviteTos.slice(0, indexList), ...inviteTos.slice(indexList + 1)]);
                    return
                }
            case 'invite_send':
                {
                    setInviteFroms([...inviteFroms.slice(0, indexList), ...inviteFroms.slice(indexList + 1)]);
                    return
                }
            default: return
        }
    }

    return (
        <div className="friend-page p-4">
            <Tabs activeKey={key} id="controlled-tab-example" className="mb-3" onSelect={(k) => setKey(k)}> 
                <Tab eventKey="list" title="Tất cả bạn bè">
                    {isLoading ? 
                        <div className="text-center mt-3">
                            <div className="spinner-border" role="status" style={{"color": "#3d41bed4"}}></div>
                        </div>
                    :
                        friends.length > 0 ? 
                        <div className="d-flex flex-wrap justify-content-between">
                            {friends.map((userFriend, index) => {
                                return (
                                    <div className="card-info mb-3" key={userFriend.slug}>
                                        <div className="user-friends-info">
                                            <img src={userFriend.avatar.path} alt="avatar-user" onClick={() => history.push(`/${userFriend.slug}`)}></img>
                                            <div className="ms-2">
                                                <span className="fw-bold name-user" onClick={() => history.push(`/${userFriend.slug}`)}>{userFriend.name}</span><br/>
                                                <span className="text-secondary" style={{"fontSize": "14px"}}>{changeTime(userFriend.created)}</span>
                                            </div>
                                        </div>
                                        <ButtonStatusFriend initFriend={userFriend.friend} toSlugUser={userFriend.slug} indexList={index} onDeleteList={onDeleteList}  nameList={'list'}/>
                                    </div>
                                )
                            })}
                        </div>
                        :
                        <div className="no-data">Không có bạn bè!</div>}
                </Tab>
                <Tab eventKey="invite_request" title="Lời mời kết bạn">
                    {isLoading ? 
                        <div className="text-center mt-3">
                            <div className="spinner-border" role="status" style={{"color": "#3d41bed4"}}></div>
                        </div>
                    :
                    inviteTos.length > 0 ? 
                    <div className="d-flex flex-wrap justify-content-between">
                        {inviteTos.map((userInvite, index) => {
                            return (
                                <div className="card-info mb-3" key={userInvite.friend.id_invite}>
                                    <div className="user-friends-info">
                                        <img src={userInvite.avatar.path} alt="avatar-user" onClick={() => history.push(`/${userInvite.slug}`)}></img>
                                        <div className="ms-2">
                                            <span className="fw-bold name-user" onClick={() => history.push(`/${userInvite.slug}`)}>{userInvite.name}</span><br/>
                                            <span className="text-secondary" style={{"fontSize": "14px"}}>{changeTime(userInvite.created)}</span>
                                        </div>
                                    </div>
                                    <ButtonStatusFriend initFriend={userInvite.friend} toSlugUser={userInvite.slug} indexList={index} onDeleteList={onDeleteList}  nameList={'invite_request'}/>
                                </div>
                            )
                        })}
                    </div>
                    :
                    <div className="no-data">Không có lời mời kết bạn!</div>}
                </Tab>
                <Tab eventKey="invite_send" title="Lời mời đã gửi">
                    {isLoading ? 
                        <div className="text-center mt-3">
                            <div className="spinner-border" role="status" style={{"color": "#3d41bed4"}}></div>
                        </div>
                    :
                    inviteFroms.length > 0 ? 
                    <div className="d-flex flex-wrap justify-content-between">
                         {inviteFroms.map((userInvite, index) => {
                            return (
                                <div className="card-info mb-3" key={userInvite.friend.id_invite}>
                                    <div className="user-friends-info">
                                        <img src={userInvite.avatar.path} alt="avatar-user" onClick={() => history.push(`/${userInvite.slug}`)}></img>
                                        <div className="ms-2">
                                            <span className="fw-bold name-user" onClick={() => history.push(`/${userInvite.slug}`)}>{userInvite.name}</span><br/>
                                            <span className="text-secondary" style={{"fontSize": "14px"}}>{changeTime(userInvite.created)}</span>
                                        </div>
                                    </div>
                                    <ButtonStatusFriend initFriend={userInvite.friend} toSlugUser={userInvite.slug} indexList={index} onDeleteList={onDeleteList}  nameList={'invite_send'}/>
                                </div>
                            )
                        })}
                    </div>
                    :
                    <div className="no-data">Không có gửi kết bạn!</div>}
                </Tab>
            </Tabs>
        </div>
    )
}

export default Friends;