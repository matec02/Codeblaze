import React, { useState } from 'react';
import './RegisterScooterForm.css';
import { jwtDecode }  from 'jwt-decode';
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
    const [showNotification, setShowNotification] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loginNotification, setLoginNotification] = useState('');
    const [scooter, setScooter] = useState({
        manufacturer: '',
        model: '',
        batteryCapacity: null,
        maxSpeed: null,
        imagePath: '',
        maxRange: null,
        yearOfManufacture: null,
        additionalInformation: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [scooterPhoto, setScooterPhoto] = useState(null);

    const handleFileChange = (event, setFileState) => {
        setFileState(event.target.files[0]);
    }

    const handleChange = (event) => {
        setScooter({ ...scooter, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        // Retrieve nickname from token
        const nickname = getNicknameFromToken();
        if (!nickname) {
            setErrorMessage('User not authenticated.');
            return;
        }

        try {
            // First, make a GET request to fetch the user by nickname
            const userResponse = await fetch(`/api/users/by-nickname/${nickname}`);
            if (!userResponse.ok) {
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
                    const handleScootersAndUpgradeRole = async () => {
                        const result = await checkScootersAndUpgrade(user.userId);
                        if (result.success) {
                            setLoginNotification('Please log in again to update your permissions.');
                            setTimeout(() => setLoginNotification(''), 5000);
                        }
                    }
                    setIsSubmitting(false);
                    setShowNotification(true);
                    setTimeout(() => {
                        setShowNotification(false);
                        window.location.reload();
                    }, 1500);
                } else {
                    setErrorMessage('Scooter registration failed.');
                    console.error('Scooter registration failed:', response.statusText);
                }



                const scooterData = { ...scooter, imagePath: photoUrl };

            } catch (error) {
                console.error('Image upload error:', error);
                setErrorMessage('Image upload failed.');
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setErrorMessage('Registration failed.');
            setIsSubmitting(false);
        }
    };


    return (
        <div className="register-scooter-form">
            <form onSubmit={handleSubmit}>
                <label>
                    Proizvođač:
                    <input type="text" name="manufacturer"
                           value={scooter.manufacturer} onChange={handleChange}
                           placeholder="Upišite ime proizvođača romobila"
                           required
                    />
                </label>
                <label>
                    Model:
                    <input type="text" name="model"
                           value={scooter.model} onChange={handleChange}
                           placeholder="Upišite model romobila"
                           required
                    />
                </label>
                <label>
                    Kapacitet baterije:
                    <input type="number" name="batteryCapacity"
                           value={scooter.batteryCapacity}
                           onChange={handleChange}
                           placeholder="Upišite kapacitet baterije romobila u kWh"
                           required min="0"
                    />
                </label>
                <label>
                    Maksimalna brzina:
                    <input type="number" name="maxSpeed"
                           value={scooter.maxSpeed} onChange={handleChange}
                           placeholder="Upišite maksimalnu brzinu romobila u km/h"
                           required min="0"
                    />
                </label>
                <div className="form-group">
                    <label>Slika romobila:</label>
                    <input type="file" onChange={(e) => handleFileChange(e, setScooterPhoto)} required/>
                </div>
                <label>
                    Maksimalni domet:
                    <input type="number" step="0.1" name="maxRange"
                           value={scooter.maxRange} onChange={handleChange}
                           placeholder="Upišite maksimalni domet romobila"
                           min="0"
                    />
                </label>
                <label>
                    Godina proizvodnje:
                    <input type="number" name="yearOfManufacture"
                           value={scooter.yearOfManufacture} onChange={handleChange}
                           placeholder="Upišite godinu proizvodnje romobila"
                           min="2000"
                           max={new Date().getFullYear()}
                    />
                </label>
                <label>
                    Dodatne informacije:
                    <textarea name="additionalInformation" value={scooter.additionalInformation}
                              onChange={handleChange}
                              placeholder="Upišite dodatne informacije o romobilu"
                              style={{ width: '100%',
                                  height: '80px',
                                  resize: 'none'
                              }}
                    />
                </label>
                <button type="submit" disabled={isSubmitting}>Register Scooter</button>

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
