import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import './MyProfile.css';


export const getNicknameFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        return null;
    }
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.nickname;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

function MyProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [privacySettings, setPrivacySettings] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const nickname = getNicknameFromToken();
            if (nickname) {
                try {
                    const response = await fetch(`/api/users/by-nickname/${nickname}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);

                        fetchPrivacySettings(userData.userId);
                    } else {
                        setErrorMessage('Unable to fetch user data.');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setErrorMessage('An error occurred while fetching user data.');
                }
            } else {
                setErrorMessage('No user token found. Please log in.');
            }
        };

        const fetchPrivacySettings = async (userId) => {
            try {
                const response = await fetch(`/api/privacy-settings/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const settings = await response.json();
                    setPrivacySettings(settings);
                } else {
                    setErrorMessage('Unable to fetch privacy settings.');
                }
            } catch (error) {
                console.error('Error fetching privacy settings:', error);
                setErrorMessage('An error occurred while fetching privacy settings.');
            }
        };




        fetchUserData();
    }, []);

    const handlePrivacyChange = (field, value) => {
        setPrivacySettings({
            ...privacySettings,
            [field]: value,
        });
    };

    const savePrivacySettings = async () => {

        try {
            const PrivacySettingsSaveDTO = {user: user, privacySettings: privacySettings};

            const response = await fetch(`/api/privacy-settings/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(PrivacySettingsSaveDTO),
            });

            if (response.ok) {
                navigate("/")


            } else {
                setErrorMessage('Failed to save privacy settings.');
            }
        } catch (error) {
            console.error('Error saving privacy settings:', error);
            setErrorMessage('An error occurred while saving privacy settings.');
        }
    };

    if (errorMessage) {
        return <div>Error: {errorMessage}</div>;
    }

    if (!user || !privacySettings) {
        return <div><h3>Učitavanje podataka...</h3></div>;
    }

    const deleteProfile = async (userId, status) => {
        try {
            const response = await fetch(`/api/users/${userId}/update-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: status })
            });
            if (response.ok) {
                localStorage.removeItem('authToken');
                navigate('/');
            } else {
                setErrorMessage('Failed to delete profile.');
            }
        } catch (error) {
            console.error('Error deleting profile:', error);
            setErrorMessage('An error occurred while deleting profile.');
        }
    };

    const editProfileClick = () => {
        navigate('/editprofile');
    };

    return (
        <div>
            <div className="container">
                <div className="title">Osobne informacije</div>
                <div className="infoSection">
                    <div className="infoRow">
                        <span className="infoLabel">Ime:</span>
                        <span className="infoValue">{user.firstName}</span>
                    </div>
                    <div className="infoRow">
                        <span className="infoLabel">Prezime:</span>
                        <span className="infoValue">{user.lastName}</span>
                    </div>
                    <div className="infoRow">
                        <span className="infoLabel">Nadimak:</span>
                        <span className="infoValue">{user.nickname}</span>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="title">Kontakt podaci</div>
                <div className="infoSection">
                    <div className="infoRow">
                        <span className="infoLabel">Email:</span>
                        <span className="infoValue">{user.email}</span>
                    </div>
                    <div className="infoRow">
                        <span className="infoLabel">Broj mobitela:</span>
                        <span className="infoValue">{user.phoneNumber}</span>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="title">Postavke privatnosti</div>
                <div className="infoSection">

                    <div className="infoRow">
                        <span className="infoLabel">Ime:</span>
                        <div className="radioGroup">
                            <label>
                                <input
                                    type="radio"
                                    name="isFirstNameVisible"
                                    checked={privacySettings.firstNameVisible}
                                    onChange={() => handlePrivacyChange('firstNameVisible', true)}
                                />
                                Javno
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="isFirstNameVisible"
                                    checked={!privacySettings.firstNameVisible}
                                    onChange={() => handlePrivacyChange('firstNameVisible', false)}
                                />
                                Privatno
                            </label>
                        </div>
                    </div>

                    <div className="infoRow">
                        <span className="infoLabel">Prezime:</span>
                        <div className="radioGroup">
                            <label>
                                <input
                                    type="radio"
                                    name="isLastNameVisible"
                                    checked={privacySettings.lastNameVisible}
                                    onChange={() => handlePrivacyChange('lastNameVisible', true)}
                                />
                                Javno
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="isLastNameVisible"
                                    checked={!privacySettings.lastNameVisible}
                                    onChange={() => handlePrivacyChange('lastNameVisible', false)}
                                />
                                Privatno
                            </label>
                        </div>
                    </div>


                    <div className="infoRow">
                        <span className="infoLabel">Broj mobitela:</span>
                        <div className="radioGroup">
                            <label>
                                <input
                                    type="radio"
                                    name="isPhoneNumberVisible"
                                    checked={privacySettings.phoneNumberVisible}
                                    onChange={() => handlePrivacyChange('phoneNumberVisible', true)}
                                />
                                Javno
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="isPhoneNumberVisible"
                                    checked={!privacySettings.phoneNumberVisible}
                                    onChange={() => handlePrivacyChange('phoneNumberVisible', false)}
                                />
                                Privatno
                            </label>
                        </div>
                    </div>


                    <div className="infoRow">
                        <span className="infoLabel">Email:</span>
                        <div className="radioGroup">
                            <label>
                                <input
                                    type="radio"
                                    name="isEmailNameVisible"
                                    checked={privacySettings.emailVisible}
                                    onChange={() => handlePrivacyChange('emailVisible', true)}
                                />
                                Javno
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="isEmailVisible"
                                    checked={!privacySettings.emailVisible}
                                    onChange={() => handlePrivacyChange('emailVisible', false)}
                                />
                                Privatno
                            </label>
                        </div>
                    </div>
                </div>
                <button onClick={savePrivacySettings}>Save</button>
            </div>

            <div className="container">
                <div className="title">Uređivanje profila</div>
                <div className="infoSection">
                    <div className="buttonRow">
                        <button onClick={editProfileClick}>Uredi profil</button>
                    </div>
                    <div className="buttonRow">
                        <button className="deleteButton" onClick={() => deleteProfile(user.userId, "DELETED")}>Obriši profil</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyProfile;