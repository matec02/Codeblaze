import {useNavigate} from 'react-router-dom';

function NavBar() {
    const navigate = useNavigate();  // Hook to get history object


    return (
        <header>
            <nav className="navbar">
                <div className="navbar-logo" onClick={() => navigate('/')}>
                    <img src="#" alt="Logo"/>
                </div>
                <ul className="navbar-links">
                    <li onClick={() => navigate('/')}>Početna</li>
                    <li onClick={() => navigate('/#')}>Iznajmi</li>
                    <li onClick={() => navigate('/#')}>Poruke</li>
                </ul>
                <div className="navbar-login" onClick={() => navigate('/login')}>
                    Login
                </div>
            </nav>
        </header>

    );
}


export default NavBar;
