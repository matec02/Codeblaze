import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Nickname</label>
                <input
                    type="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>First name</label>
                <input
                    type="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Last name</label>
                <input
                    type="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Card number</label>
                <input
                    type="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Phone Number</label>
                <input
                    type="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <button type="submit">Login</button>
        </form>
    );
}

export default RegisterForm;
