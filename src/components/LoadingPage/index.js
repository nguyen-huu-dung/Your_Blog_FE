import logo from '../../public/image/loading.svg';
import './index.scss';

const LoadingPage = () => {
    return (
        <div className="loading-page">
            <div className="main">
                <div className="shadow-wrapper">
                    <div className="shadow-dragon"></div>
                </div>
                <div className="dragon">
                    <div className="body"></div>
                    <div className="horn-left"></div>
                    <div className="horn-right"></div>
                    <div className="eye left"></div>
                    <div className="eye right"></div>
                    <div className="blush left"></div>
                    <div className="blush right"></div>
                    <div className="mouth"></div>
                    <div className="tail-sting"></div>
                </div>
                <div className="fire-wrapper">
                    <div className="fire"></div>
                </div>
                <div className="progress-dragon">
                    <div id="inTurnFadingTextG">
                        <div id="inTurnFadingTextG_1" className="inTurnFadingTextG">L</div>
                        <div id="inTurnFadingTextG_2" className="inTurnFadingTextG">o</div>
                        <div id="inTurnFadingTextG_3" className="inTurnFadingTextG">a</div>
                        <div id="inTurnFadingTextG_4" className="inTurnFadingTextG">d</div>
                        <div id="inTurnFadingTextG_5" className="inTurnFadingTextG">i</div>
                        <div id="inTurnFadingTextG_6" className="inTurnFadingTextG">n</div>
                        <div id="inTurnFadingTextG_7" className="inTurnFadingTextG">g</div>
                        <div id="inTurnFadingTextG_8" className="inTurnFadingTextG">.</div>
                        <div id="inTurnFadingTextG_9" className="inTurnFadingTextG">.</div>
                        <div id="inTurnFadingTextG_10" className="inTurnFadingTextG">.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoadingPage;