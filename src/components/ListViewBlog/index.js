import { useHistory } from "react-router";
import { cutStringTitle } from "../../utils/supports";
import "./index.scss";

const ListViewBlog = ({blogs, isBlogManagement}) => {
    const history = useHistory();
    return (
        <div className="list-view-blog">
            {blogs.map((blog, index) => {
                return (
                    <div className="card mb-3" key={blog.slug} data-bs-toggle="tooltip" data-bs-placement="right" title={blog.title} onClick={() => history.push(`/${isBlogManagement ? 'blogs_management' : blog.user.slug}/${blog.slug}`)}>
                        <img src={blog.image} className="card-img-top" alt="blog"></img>
                        <div className="card-body">
                            <h5 className="card-title mb-1">{cutStringTitle(blog.title)}</h5>
                            {!isBlogManagement && <p className="card-text mb-1">{blog.user.name}</p>}
                            {blog.status === 'public' ? <p className="card-text"><i className="fas fa-globe-asia"></i><span> Công khai</span></p>
                            : 
                            blog.status === 'friend' ? <p className="card-text"><i className="fas fa-user-friends"></i><span> Bạn bè</span></p>
                            :
                            <p className="card-text"><i className="fas fa-lock"></i><span> Riêng tư</span></p>}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ListViewBlog;