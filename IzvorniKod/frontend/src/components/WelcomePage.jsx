import Slider from 'react-slick';
import './Home.css';

function WelcomePage({ photo1, photo2, photo3, textBeforeBreak, textAfterBreak }) {
    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3750,
        lazyLoad: true,
        arrows: false
    };
    return (
        <div className="welcome-page">
            <div className="welcome-container">
                <h5>{textBeforeBreak}<br/>{textAfterBreak}</h5>
            </div>
                <div className="welcomeImageContainer">
                    <img src={photo1} alt="Scooter Adventure" />
                </div>


        </div>
    );
}


export default WelcomePage;