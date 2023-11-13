import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './RegisterForm.css'

function RegisterForm() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        setErrorMessage('');

        const user = {
            email,
            nickname,
            firstName,
            lastName,
            cardNumber,
            phoneNumber,
            password
        };

        try {
            const response = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);

                localStorage.setItem('userStatus', result.status);

                navigate('/login');
            } else {
                setErrorMessage('Registration failed.');
                console.error('Registration failed:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setErrorMessage('Registration failed.');
        }

        // Initialize Privacy Settings
        try {
            const response = await fetch('http://localhost:8080/api/privacy-settings/initialize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                console.log('Default privacy settings are set')
            } else {
                setErrorMessage('Privacy Settings initialization failed.');
                console.error('Privacy settings initialization failed:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setErrorMessage('Initialization failed.');
        }
    };

    return (
        <div className="register-form-container">
            <h2 className="form-title">Registracija</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Nickname:</label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>First Name:</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Card Number:</label>
                    <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <button type="submit" className="register-form-button">Register</button>
                </div>

                {errorMessage && <div className="form-group error-message">{errorMessage}</div>}
            </form>
        </div>
    );
}

export default RegisterForm;