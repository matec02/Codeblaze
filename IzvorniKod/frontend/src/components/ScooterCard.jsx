import React, {useCallback, useState} from 'react';
import './ScooterCard.css'
import ProfileAvatar from '../assets/profile-avatar.png';
import {useNavigate} from "react-router-dom";
import {getNicknameFromToken} from "./RegisterScooterForm";
import {sendMessageWithAction, startConversation} from "../utils/MessageUtils";
import {getCodeblazeUser} from "../utils/authService";


function ScooterCard({ scooter }) {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [currentImageSrc, setCurrentImageSrc] = useState('');
    const [isRequestOpen, setIsRequestOpen] = useState(false);
    const [newImage, setNewImage] = useState('');
    const [comments, setComments] = useState({
        comments: ''
    });
    const [userProfile, setUserProfile] = useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const { scooterId, imagePath, model, maxSpeed, batteryCapacity } = scooter;

    const handleViewProfile = async () => {
        try {
            const response = await fetch(`/api/users/${scooter.user.userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }
            const profileData = await response.json();
            setUserProfile(profileData);
            setIsProfileModalOpen(true);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const ProfileModal = ({ isOpen, onClose, profile }) => {
        if (!isOpen) return null;

        const handleStartConversation = async () => {
            const { chatSessionId } = await startConversation(profile);
            if (chatSessionId) {
                navigate(`/chat-window/${chatSessionId}`);
            } else {
                console.log("Unable to start conversation")
            }
        }

        async function handleTestButton() {
            const user2 = await getCodeblazeUser()
            sendMessageWithAction("Codeblaze", user2);
        }

        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h3>{profile.nickname}</h3>
                    <h4>Name {profile.firstName}</h4>
                    <h4>Lastname {profile.lastName}</h4>
                    <h4>E-mail {profile.email}</h4>
                    <button onClick={handleTestButton}>TEST BUTTON</button>
                    <button onClick={handleStartConversation}>Pošalji Poruku</button>
                    <button className="modal-close-button" onClick={onClose}>Close</button>
                </div>
            </div>
        );
    };

    const openImageModal = useCallback((imageSrc) => {
        setCurrentImageSrc(imageSrc);
        setIsImageOpen(true);
    }, []);

    const closeImageModal = useCallback(() => {
        setIsImageOpen(false);
    }, []);

    const openRequestModal = useCallback((imageSrc) => {
        setCurrentImageSrc(imageSrc);
        setIsRequestOpen(true);
    }, []);

    const closeRequestModal = useCallback(() => {
        setIsRequestOpen(false);
    }, []);

    const ImageModal = ({isOpen, onClose, imageSrc, altText }) => {
        if (!isOpen) return null;
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="image-container">
                        <img src={imageSrc} alt={altText} />
                    </div>
                    <div className="modal-close-btn-container">
                        <button className="modal-close-button" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        );
    };

    const handleFileChange = (event, setFileState) => {
        setFileState(event.target.files[0]);
    }

    const handleChange = (event) => {
        setComments({
            ...comments,
            [event.target.name]: event.target.value
        });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

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

            const formDataNewImage = new FormData();
            formDataNewImage.append('file', newImage);
            formDataNewImage.append('userkey', "fgJxNmfTGEu8wVx8yi21OVuUxeDefFXn");

            const imageResponse = await fetch('https://vgy.me/upload', {
                method: 'POST',
                body: formDataNewImage,
            });

            if (imageResponse.ok) {
                const imageUploadData = await imageResponse.json();
                const photoUrlCR = imageUploadData.image;

                const newImageFormData = new FormData();
                newImageFormData.append("photoUrlNewImage", new Blob([JSON.stringify(photoUrlCR)], { type: "application/json" }));
                newImageFormData.append('user', new Blob([JSON.stringify(user)], { type: "application/json" }));

                const registrationResponse = await fetch('/api/registration/complete', {
                    method: 'POST',
                    body: newImageFormData,
                });

                if (registrationResponse.ok) {
                    const result = await registrationResponse.json();
                    localStorage.setItem('userStatus', 'registered');
                    navigate('/login');
                } else {
                    console.error("Registration API failed: " + registrationResponse.statusText);
                    setErrorMessage('Registration failed.');
                }
            } else {
                console.error('Image upload failed: ' + imageResponse.statusText);
                setErrorMessage('Image upload failed.');
            }
        } catch (error) {
            console.error('An error occurred: ', error);
            setErrorMessage('Registration failed.');
        }
    };



    const RequestChangeModal = ({isOpen, onClose, imageSrc, altText }) => {
        if (!isOpen) return null;
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={handleSubmit} className="register-form">
                        {/* File Upload Section */}
                        <div className="section-container">
                            <div className="form-group">
                                <label>Priložiti novu sliku</label>
                                <input type="file" onChange={(e) => handleFileChange(e, setNewImage)} required/>
                            </div>
                            <div className="form-group">
                                <label> Dodatni komentari </label>
                                <input type="text" value={comments.comments} onChange={handleChange}/>
                            </div>
                        </div>
                    </form>
                    <div className="modal-close-btn-container">
                        <button className="modal-close-button" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="scooter">
            <img src={ProfileAvatar} alt={"PROFILE"} className="profile-avatar" onClick={handleViewProfile} style={{ cursor: 'pointer' }} />
            <img src={imagePath} alt={`${model} Scooter`} className="scooter-image" onClick={() => openImageModal(imagePath)}/>
            <h3 className="scooter-name">{model}</h3>
            <div className="scooter-details">
                <p><strong>Brzina:</strong> {maxSpeed} km/h</p>
                <p><strong>Kapacitet:</strong> {batteryCapacity} kWh</p>
            </div>
            <button className="scooter-button">Unajmi</button>
            <button className="scooter-button" onClick={() => openRequestModal(imagePath)}>Prijavi</button>
            <ImageModal
                isOpen={isImageOpen}
                onClose={closeImageModal}
                imageSrc={currentImageSrc}
                altText="Romobil"
            />
            <RequestChangeModal
                isOpen={isRequestOpen}
                onClose={closeRequestModal}
                imageSrc={currentImageSrc}
                altText="Romobil"
            />
            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                profile={userProfile}
            />
        </div>
    );
}

export default ScooterCard;
