import {useNavigate} from 'react-router-dom';
import myAccount from '../assets/my-account.png';
import logo from '../assets/CodeblazeLogo.png';

function NavBar() {
    const navigate = useNavigate();  // Hook to get history object


    return (
        <header>
            <nav className="navbar">
                <div className="navbar-logo" onClick={() => navigate('/')}>
                    <img src={logo} alt="Logo"/>
                </div>
                <ul className="navbar-links">
                    <li onClick={() => navigate('/')}>Početna</li>
                    <li onClick={() => navigate('/scooters')}>Tvoji Romobili</li>
                    <li onClick={() => navigate('/#')}>Poruke</li>
                </ul>
                <div className="navbar-login" onClick={() => navigate('/login')}>
                    Login
                </div>
                {/*<div className="navbar-register" onClick={() => navigate('/register')}>*/}
                {/*    Register*/}
                {/*</div>*/}

                <div className="navbar-account" onClick={() => navigate('/profile')}>
                    <img src={myAccount} alt="My Account"/>
                {/*   TODO dodati novi page za profil, dodati page za postaviti romobil (ne treba backend),
                 dodati page za iznajmiti romobil(oglas) dodati page za poruke, generirati logo gpt skuter poslagati s bazom (drive upload)
                 postaviti constrainte na upis login (neke card, broj telefona (nema char), lozinka omogućiti gledanje čitave,
                 dodati register button pored login kako god, urediti registracija, hash za card number BEncrypt
                 Phone number splitati +385 i ostatak broja), dodati constraint na password
                 Nakon prijave maknuti login/register i onda ima profil inace ga nemaa*/}
                </div>
            </nav>
        </header>

    );
}


export default NavBar;
