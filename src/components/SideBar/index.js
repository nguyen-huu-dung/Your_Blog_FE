import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import TriggerTooltip from "../TriggerToolip";
import './index.scss';

const SideBar = () => {
    const { browserState: { isOpenSideBar } } = useSelector(state => {
        return { browserState: state.browserState }
    })

    return(
        <div className={`${isOpenSideBar ? "isOpenSideBar" : "isCloseSideBar"} left-menu position-fixed`}>
            <ul className="nav nav-pills flex-column mb-auto">
                <li>
                    <NavLink exact to='/' className={`${isOpenSideBar ? "isShow" : "isHide"} p-2 text-decoration-none`}>
                        {
                        isOpenSideBar ?  <span><i className="fas fa-home me-2"></i>Trang chủ</span>
                        :
                        <TriggerTooltip placement="right" contentTooltip="Trang chủ" contentHTML={<span><i className="fas fa-home me-2"></i></span>}/>
                        }   
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/blogs_management' className={`${isOpenSideBar ? "isShow" : "isHide"} p-2 text-decoration-none`}>
                        {
                        isOpenSideBar ?  <span><i className="fas fa-blog me-2"></i>Blog cá nhân</span>
                        :
                        <TriggerTooltip placement="right" contentTooltip="Blog cá nhân" contentHTML={<span><i className="fas fa-blog me-2"></i></span>}/>
                        }   
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/friends' className={`${isOpenSideBar ? "isShow" : "isHide"} p-2 text-decoration-none`}>
                        {
                        isOpenSideBar ?  <span><i className="fas fa-user-friends me-2"></i>Bạn bè</span>
                        :
                        <TriggerTooltip placement="right" contentTooltip="Bạn bè" contentHTML={<span><i className="fas fa-user-friends me-2"></i></span>}/>
                        }   
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}

export default SideBar;