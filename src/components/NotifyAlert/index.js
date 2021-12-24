import { Alert, ProgressBar } from "react-bootstrap";
import { useSelector } from "react-redux";

const NotifyAlert = () => {
    const { browserState: { notify }} = useSelector(state => {
        return { browserState: state.browserState}
    })

    return (
        <Alert variant={notify.success ? "success" : "danger"} className="py-2 px-3 mt-2">
            {notify.success ? 
            <span><i className="far fa-check-circle"></i> {notify.message}</span> 
            :
            <span><i className="far fa-times-circle"></i> {notify.message}</span>
            }
        </Alert>
    )
}

export default NotifyAlert;