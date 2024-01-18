import Slider from 'react-slick';
import './Home.css';

function WelcomePage({ textBeforeBreak, textAfterBreak }) {

    return (
        <div className="welcome-page">
            <div className="welcome-container">
                <h5>{textBeforeBreak}<br/>{textAfterBreak}</h5>
            </div>
        </div>
    );
}


export default WelcomePage;