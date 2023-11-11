import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './LoginForm.css'

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();  // Hook to get history object

    const handleSubmit = async (event) => {
        event.preventDefault();

        setErrorMessage('');

        const loginDetails = {
            email,
            password
        };

        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginDetails),
            });

            const data = await response.json();
            if (response.ok) {
                if (data.status == "PENDING"){
                    navigate('/profile-pending')
                } else if (data.status == "BLOCKED"){
                    localStorage.setItem('authToken', data.authToken);
                    navigate('/profile-blocked')
                }
                else {
                    localStorage.setItem('authToken', data.authToken);
                    navigate('/');
                }
            } else {
                setErrorMessage(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
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
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-form-button">Prijava</button>
            </form>
            <p className="register-link">
                Nemate račun? <span onClick={() => navigate('/register')}>Registrirajte se.</span>
            </p>
        </div>
    );
}

export default LoginForm;
