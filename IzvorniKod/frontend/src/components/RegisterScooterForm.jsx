import React, {useState} from 'react';
import './RegisterScooterForm.css';
import {useNavigate} from "react-router-dom";
import {jwtDecode} from 'jwt-decode';
import {upgradeUserRole} from "../utils/UpgradeUserRole"

export const getNicknameFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        return null;
    }
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.nickname; // or the appropriate field name where the nickname is stored
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

function RegisterScooterForm() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [scooter, setScooter] = useState({
        manufacturer: '',
        model: '',
        batteryCapacity: 0,
        maxSpeed: 0,
        imageURL: '',
        maxRange: 0.0,
        yearOfManufacture: 2023,
        additionalInformation: ''
    });


    const handleChange = (event) => {
        setScooter({...scooter, [event.target.name]: event.target.value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Retrieve nickname from token
        const nickname = getNicknameFromToken();
        console.log(nickname);
        if (!nickname) {
            setErrorMessage('User not authenticated.');
            return;
        }

        try {
            // First, make a GET request to fetch the user by nickname
            const userResponse = await fetch(`http://localhost:8080/api/users/by-nickname/${nickname}`);
            if (!userResponse.ok) {
                console.log(userResponse);
                setErrorMessage('User not found.');
                console.error('User not found:', userResponse.statusText);
                return;
            }
            const user = await userResponse.json();
            const ScooterRegistrationDTO = {user: user, scooter: scooter};
            // Then, make the POST request to register the scooter
            const response = await fetch('http://localhost:8080/api/scooters/register-scooter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ScooterRegistrationDTO),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Scooter Registered: ", result);
                const newToken = await upgradeUserRole(user.id);
                if (newToken) {
                    localStorage.setItem('authToken', newToken);
                    console.log('User role upgraded and token refreshed');
                } else {
                    console.error('Failed to upgrade user role or refresh token');
                }
                navigate('/home');
            } else {
                setErrorMessage('Scooter registration failed.');
                console.error('Scooter registration failed:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setErrorMessage('Registration failed.');
        }
    };


    return (
        <div className="register-scooter-form">
            <form onSubmit={handleSubmit}>
                <label>
                    Proizvođač:
                    <input type="text" name="manufacturer" value={scooter.manufacturer} onChange={handleChange}/>
                </label>
                <label>
                    Model:
                    <input type="text" name="model" value={scooter.model} onChange={handleChange}/>
                </label>
                <label>
                    Kapacitet baterije:
                    <input type="number" name="batteryCapacity" value={scooter.batteryCapacity}
                           onChange={handleChange}/>
                </label>
                <label>
                    Najveća brzina:
                    <input type="number" name="maxSpeed" value={scooter.maxSpeed} onChange={handleChange}/>
                </label>
                <label>
                    URL slike:
                    <input type="text" name="imageURL" value={scooter.imageURL} onChange={handleChange}/>
                </label>
                <label>
                    Domet:
                    <input type="number" step="0.1" name="maxRange" value={scooter.maxRange} onChange={handleChange}/>
                </label>
                <label>
                    Godina proizvodnje:
                    <input type="number" name="yearOfManufacture" value={scooter.yearOfManufacture}
                           onChange={handleChange}/>
                </label>
                <label>
                    Dodatne informacije:
                    <textarea name="additionalInformation" value={scooter.additionalInformation}
                              onChange={handleChange}/>
                </label>
                <button type="submit">Registriraj romobil</button>

                {errorMessage && <div className="form-group error-message">{errorMessage}</div>}
            </form>
        </div>
    );
}

export default RegisterScooterForm;
