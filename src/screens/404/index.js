import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { actSetIsLoadingPage } from '../../redux/actions/browser.action';
import './index.scss';

const Custom404 = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actSetIsLoadingPage(false));
        return () => {
            dispatch(actSetIsLoadingPage(true));
        }
    }, [])
    return(
        <div className={"error_404_page d-flex flex-column align-items-center justify-content-center text-center"}>
            <h1 className="text-format-head" data-head="404">404</h1>
            <p className="text-format mt-2" data-p="This page could not be found">This page could not be found</p>
        </div>
    )
}

export default Custom404;