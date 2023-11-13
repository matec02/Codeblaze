import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './RegisterForm.css'
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import {FaEye, FaEyeSlash} from 'react-icons/fa';

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

    // Extra state variables
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return; // Stop the form submission if passwords do not match
        }

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
        <div className="register-form-container">
            <h2 className="form-title">Registracija</h2>
            <form onSubmit={handleSubmit} className="register-form">

                {/* Personal Information Section */}
                <div className="section-container">
                    <div className="section-title">Osobni podaci</div>
                    <div className="form-group">
                        <label>Ime:</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>
                    </div>
                    <div className="form-group">
                        <label>Prezime:</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required/>
                    </div>
                    <div className="form-group">
                        <label>Nadimak:</label>
                        <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required/>
                    </div>
                </div>

                {/* Contact Information Section */}
                <div className="section-container">
                    <div className="section-title">Kontakt podaci</div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div className="form-group">
                        <label>Broj mobitela:</label>
                        <PhoneInput defaultCountry="HR" value={phoneNumber}
                                    onChange={setPhoneNumber} required/>
                    </div>
                </div>

                {/* Payment and Security Section */}
                <div className="section-container">
                    <div className="section-title">Plaćanje i sigurnost</div>
                    <div className="form-group">
                        <label>Broj kartice:</label>
                        <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Lozinka:</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="toggle-password-button"
                            >
                                {showPassword ? <FaEyeSlash/> : <FaEye/>}
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Potvrdi lozinku:</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="toggle-password-button"
                            >
                                {showPassword ? <FaEyeSlash/> : <FaEye/>}
                            </button>
                        </div>
                    </div>
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