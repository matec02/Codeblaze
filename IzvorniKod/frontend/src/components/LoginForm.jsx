import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './LoginForm.css'
import {jwtDecode} from "jwt-decode";

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [admins, setAdmins] = useState([]);
    const navigate = useNavigate();
    const [isInvalidCredentials, setIsInvalidCredentials] = useState(false);

    useEffect(() => {
        handleAdmins();
    }, []);

    const handleAdmins = async () => {
        try {
            const response = await fetch("/api/users/admins", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setAdmins(data.map(admin => admin.nickname));

        } catch (error) {
            console.error("Failed to get Admins: ", error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setErrorMessage('');

        const loginDetails = {
            email,
            password
        };



        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginDetails),
            });

            const data = await response.json();
            if (response.ok) {
                if (data.status == "PENDING"){
                    localStorage.setItem('authToken', data.authToken);
                    navigate('/profile-pending')
                } else if (data.status == "BLOCKED"){
                    //localStorage.setItem('authToken', data.authToken); TODO protect all routes
                    navigate('/profile-blocked')
                } else if (data.status == "REJECTED"){
                    navigate('/profile-rejected')
                }
                else {
                    localStorage.setItem('authToken', data.authToken);
                    const decodedToken = jwtDecode(data.authToken);

                    const isAdmin = admins.includes(decodedToken.nickname);
                    const path = isAdmin ? '/admin-home' : '/home';
                    navigate(path);
                    window.location.reload()
                }
            } else {
                setErrorMessage(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            setIsInvalidCredentials(true);
            console.error('Login error:', error);
            setErrorMessage('Login failed. Please try again.');
        }
    };




    return (
        <div className="login-form-container">
            <h2 className="login-form-title">Prijava</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Upišite e-mail adresu"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Lozinka:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Upišite lozinku"
                        required
                    />
                </div>
                <button type="submit" className="login-form-button">Prijava</button>
            </form>
            <div className="invalid-credentials" style={{display: isInvalidCredentials ? "block" : "none"}}>
                E-mail ili lozinka su pogrešni. Pokušajte ponovno.
            </div>
            <p className="register-link">
                Nemate račun? <span onClick={() => navigate('/register')}>Registrirajte se.</span>
            </p>
        </div>
    );
}

export default LoginForm;
