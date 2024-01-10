import React, { useState } from 'react';
import './RegisterScooterForm.css';
import {Form, useNavigate} from "react-router-dom";
import { jwtDecode }  from 'jwt-decode';
import { upgradeUserRole } from "../utils/UpgradeUserRole"
import { checkScootersAndUpgrade } from "../utils/checkScootersAndUpgradeRole"

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
    const [showNotification, setShowNotification] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loginNotification, setLoginNotification] = useState('');
    const [scooter, setScooter] = useState({
        manufacturer: '',
        model: '',
        batteryCapacity: 0,
        maxSpeed: 0,
        imagePath: '',
        maxRange: 0.0,
        yearOfManufacture: 2023,
        additionalInformation: ''
    });

    const [scooterPhoto, setScooterPhoto] = useState(null);

    const handleFileChange = (event, setFileState) => {
        setFileState(event.target.files[0]);
    }

    const handleChange = (event) => {
        setScooter({ ...scooter, [event.target.name]: event.target.value });
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
            const userResponse = await fetch(`/api/users/by-nickname/${nickname}`);
            if (!userResponse.ok) {
                console.log(userResponse);
                setErrorMessage('User not found.');
                console.error('User not found:', userResponse.statusText);
                return;
            }
            const user = await userResponse.json();

            const imageFormData = new FormData();
            imageFormData.append('file', scooterPhoto);
            imageFormData.append('userkey', "fgJxNmfTGEu8wVx8yi21OVuUxeDefFXn");

            try {
                const imageUploadResponse = await fetch('https://vgy.me/upload', {
                    method: 'POST',
                    body: imageFormData,
                });

                if (!imageUploadResponse.ok) {
                    throw new Error('Failed to upload image.');
                }

                const imageUploadResult = await imageUploadResponse.json();
                console.log(imageUploadResult)
                const photoUrl = imageUploadResult.image;

                const formData = new FormData();
                formData.append('user', new Blob([JSON.stringify(user)], { type: "application/json" }));
                formData.append('scooter', new Blob([JSON.stringify(scooter)], { type: "application/json" }));
                formData.append('photoUrl', new Blob([JSON.stringify(photoUrl)], { type: "application/json" }));

                const response = await fetch('/api/scooters/register', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log("Scooter Registered: ", result);
                    const handleScootersAndUpgradeRole = async () => {
                        const result = await checkScootersAndUpgrade(user.userId);
                        if (result.success) {
                            setLoginNotification('Please log in again to update your permissions.');
                            setTimeout(() => setLoginNotification(''), 5000);
                        }
                    }
                    setShowNotification(true);
                    setTimeout(() => {
                        setShowNotification(false);
                        navigate('/home'); // Navigate after the notification
                    }, 3000);
                } else {
                    setErrorMessage('Scooter registration failed.');
                    console.error('Scooter registration failed:', response.statusText);
                }



                const scooterData = { ...scooter, imagePath: photoUrl };

            } catch (error) {
                console.error('Image upload error:', error);
                setErrorMessage('Image upload failed.');
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
                    Manufacturer:
                    <input type="text" name="manufacturer" value={scooter.manufacturer} onChange={handleChange} />
                </label>
                <label>
                    Model:
                    <input type="text" name="model" value={scooter.model} onChange={handleChange} />
                </label>
                <label>
                    Battery Capacity:
                    <input type="number" name="batteryCapacity" value={scooter.batteryCapacity} onChange={handleChange} />
                </label>
                <label>
                    Max Speed:
                    <input type="number" name="maxSpeed" value={scooter.maxSpeed} onChange={handleChange} />
                </label>
                <div className="form-group">
                    <label>Scooter Photo:</label>
                    <input type="file" onChange={(e) => handleFileChange(e, setScooterPhoto)} required/>
                </div>
                <label>
                    Max Range:
                    <input type="number" step="0.1" name="maxRange" value={scooter.maxRange} onChange={handleChange} />
                </label>
                <label>
                    Year of Manufacture:
                    <input type="number" name="yearOfManufacture" value={scooter.yearOfManufacture} onChange={handleChange} />
                </label>
                <label>
                    Additional Information:
                    <textarea name="additionalInformation" value={scooter.additionalInformation} onChange={handleChange} />
                </label>
                <button type="submit">Register Scooter</button>

                {errorMessage && <div className="form-group error-message">{errorMessage}</div>}
                {showNotification && (
                    <div className="notification-bubble">
                        Your scooter has been successfully registered!
                    </div>
                )}
            </form>
        </div>
    );
}

export default RegisterScooterForm;
