import {useNavigate} from 'react-router-dom';
import myAccount from '../assets/my-account.png';
import logo from '../assets/CodeblazeLogo.png';
import { jwtDecode } from 'jwt-decode';
import {useEffect, useState} from "react";

function NavBar() {
    const navigate = useNavigate();  // Hook to get history object
    const [loggedUserNickname, setLoggedUserNickname] = useState(null);
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setLoggedUserNickname(decodedToken.nickname);
            console.log("nickname " + decodedToken.nickname);
        }
        handleAdmins();
    }, []);

    const handleAdmins = async (event) => {
        try {
            const response = await fetch("http://localhost:8080/api/users/admins", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            setAdmins(data);

        } catch (error) {
            console.error("Failed to get Admins: ", error);
        }
    };

    const handleNavigation = () => {
        let path = '/';

        const isAdmin = admins.some(admin => admin.nickname === loggedUserNickname);

        if (isAdmin) {
            path = '/admin-home';
        }
        navigate(path);
    };

    return (
        <header>
            <nav className="navbar">
                <div className="navbar-logo" onClick={(handleNavigation)}>
                    <img src={logo} alt="Logo"/>
                </div>
                <ul className="navbar-links">
                    <li onClick={(handleNavigation)}>Početna</li>
                    <li onClick={() => navigate('/scooters')}>Tvoji Romobili</li>
                    <li onClick={() => navigate('/#')}>Poruke</li>
                </ul>
                {localStorage.getItem('authToken') ? (
                    <div className="navbar-account" onClick={() => navigate('/profile')}>
                        <img src={myAccount} alt="My Account" />
                        <span>{loggedUserNickname}</span>
                    </div>
                ) : (
                    <div>
                        <div className="navbar-login" onClick={() => navigate('/login')}>
                            Login
                        </div>
                        <div className="navbar-login" onClick={() => navigate('/register')}>
                        Register
                        </div>
                    </div>
                )}

                {/*   TODO dodati novi page za profil, dodati page za postaviti romobil (ne treba backend),
                 dodati page za iznajmiti romobil(oglas) dodati page za poruke, generirati logo gpt skuter poslagati s bazom (drive upload)
                 postaviti constrainte na upis login (neke card, broj telefona (nema char), lozinka omogućiti gledanje čitave,
                 dodati register button pored login kako god, urediti registracija, hash za card number BEncrypt
                 Phone number splitati +385 i ostatak broja), dodati constraint na password
                 Nakon prijave maknuti login/register i onda ima profil inace ga nemaa*/}

            </nav>
        </header>

    );
}


export default NavBar;
