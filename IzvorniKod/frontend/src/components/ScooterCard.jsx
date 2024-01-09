import React, {useCallback, useEffect, useState} from 'react';
import './ScooterCard.css'
import {Form, useNavigate} from "react-router-dom";
import ProfileAvatar from '../assets/profile-avatar.png';
import {getNicknameFromToken} from "./RegisterScooterForm";
import {sendMessageWithAction, startConversation} from "../utils/MessageUtils";
import {getCodeblazeUser} from "../utils/authService";

export const handleImagePathChange = async (scooterId, imagePath) => {
    try {
        const response = await fetch(`/api/scooters/${scooterId}/updateImagePath`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "imagePath": imagePath })
        });


        if (!response.ok) {
            throw new Error('Failed to update image path');
        }

    } catch (error) {
        console.error('Error updating imagePath in updating status:', error);
    }
};

function ScooterCard({ scooter }) {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [currentImageSrc, setCurrentImageSrc] = useState('');
    const [isRequestOpen, setIsRequestOpen] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [comments, setComments] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
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

    const handleFileChange = (event) => {
        if (event.target.files[0]) {
            setNewImage(event.target.files[0]);
            console.log("SLIKA KOJA JE STAVLJENA");
            console.log(newImage);
        }
    }



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
                const photoUrlNewImage = imageUploadData.image;
                const currentDateTime = new Date();
                const offset = currentDateTime.getTimezoneOffset();
                const dateTimeString = currentDateTime.toISOString();

                const newImageFormData = new FormData();
                newImageFormData.append('complaintTime',dateTimeString);
                newImageFormData.append('photoUrlOldImage', new Blob([JSON.stringify(imagePath)], { type: "application/json" }));
                newImageFormData.append('additionalComments', new Blob([JSON.stringify(comments)], { type: "application/json" }))
                newImageFormData.append('photoUrlNewImage', new Blob([JSON.stringify(photoUrlNewImage)], { type: "application/json" }));
                newImageFormData.append('user', new Blob([JSON.stringify(user)], { type: "application/json" }));

                const newImageResponse = await fetch('/api/imageChangeRequest/send', {
                    method: 'POST',
                    body: newImageFormData,
                });

                if (newImageResponse.ok) {
                    const result = await newImageResponse.json();
                    console.log(result)
                    console.log("Poslan zahtjev za promjenu")
                    setIsRequestOpen(false);
                    setNewImage(null);
                    setComments('');
                    handleImagePathChange(scooterId, photoUrlNewImage)
                    navigate('/home');
                    window.location.reload()
                } else {
                    console.error("Request failed: " + newImageResponse.statusText);
                    setErrorMessage('Request failed.');
                }
            } else {
                console.error('Image upload failed: ' + imageResponse.statusText);
                setErrorMessage('Image upload failed.');
            }
        } catch (error) {
            console.error('An error occurred: ', error);
            setErrorMessage('Request failed.');
        }
    };



    const RequestChangeModal = ({isOpen, imageSrc, altText }) => {
        return isOpen && (
            <div className="modal-overlay" onClick={()=> setIsRequestOpen(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={handleSubmit}>
                        {/* File Upload Section */}
                            <div className="form-group">
                                <label>Priložiti novu sliku</label>
                                <input type="file" onChange={(e) => setNewImage(e.target.files[0])} required/>
                            </div>
                            <label> Dodatni komentari
                                <textarea name="comments" value={comments} onChange={(e) => setComments(e.target.value)}/>
                            </label>
                            <button type="submit">Pošalji zahtjev za zamjenom slike</button>
                    </form>
                    <div className="modal-close-btn-container">
                        <button className="modal-close-button" onClick={()=> setIsRequestOpen(false)}>Close</button>
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
            <button className="scooter-button" onClick={() => setIsVisible(true)}>Prijavi</button>
            <form onSubmit={handleSubmit}>
                {/* File Upload Section */}
                <div className="imageRequest" style={{ display: isVisible ? "block" : "none" }}>
                    <h2>PRIJAVA LOŠE SLIKE</h2>
                    <div className="form-group">
                        <label>Priložiti novu sliku</label>
                        <input type="file" onChange={(e) => setNewImage(e.target.files[0])} required/>
                    </div>
                    <div className="form-group">
                        <label> Dodatni komentari
                            <textarea name="comments" value={comments} onChange={(e) => setComments(e.target.value)}/>
                        </label>
                    </div>
                    <button className="scooter-button" onClick={() => setIsVisible(false)}>Zatvori</button>
                    <button type="submit">Pošalji zahtjev za zamjenom slike</button>
                </div>
            </form>


            <ImageModal
                isOpen={isImageOpen}
                onClose={closeImageModal}
                imageSrc={currentImageSrc}
                altText="Romobil"
            />
            <RequestChangeModal
                isOpen={isRequestOpen}
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
