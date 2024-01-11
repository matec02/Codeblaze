import React, {useCallback, useState, useEffect} from 'react';
import './ScooterCard.css'
import {Form, useNavigate} from "react-router-dom";
import ProfileAvatar from '../assets/profile-avatar.png';
import {getNicknameFromToken} from "./RegisterScooterForm";
import { format } from 'date-fns';
import {sendMessageWithAction, startConversation} from "../utils/MessageUtils";
import {getCodeblazeUser} from "../utils/authService";
import { FaFacebook, FaTwitter, FaLinkedin} from 'react-icons/fa';


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
function ScooterCard({ listing }) {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [currentImageSrc, setCurrentImageSrc] = useState('');
    const [isRequestOpen, setIsRequestOpen] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [comments, setComments] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [userProfile, setUserProfile] = useState('');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAdvertised, setIsAdvertised] = useState(false);
    const [curUser, setCurUser] = useState('');
    const [isCurrentUserOwner, setIsCurrentUserOwner] = useState(false);
    const [isAdModalOpen, setIsAdModalOpen] = useState(false);


    const { scooter, clientId, status, listingId} = listing;
    const { userId, scooterId, imagePath, model, maxSpeed, batteryCapacity } = scooter;

    useEffect(() => {
        handleUser();
    }, []);

    const handleUser = async () => {
        try {
            const response = await fetch(`/api/users/by-nickname/${getNicknameFromToken()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setCurUser(data);

        } catch (error) {
            console.error("Failed to get users: ", error);
        }
    };

    const handleButtonClick = (event, action) => {
        event.stopPropagation();

        if (action === 'prijavi') {
            setIsVisible(true);
        } else if (action === 'uredi') {
            openAdModal();
        } else if (action === 'izbrisi') {
            handleDeleteListing();
        } else if (action === 'unajmi') {
            handleRequest();
        } else if (action === 'vrati') {
            handleReturn();
        }
    };

    const handleViewProfile = async (event) => {
        event.stopPropagation();
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

    async function handleTestButton() {
        const user2 = await getCodeblazeUser()
        sendMessageWithAction("Codeblaze", user2);
    }

    const ProfileModal = ({ isOpen, onClose, profile }) => {
        const [privacySettings, setPrivacySettings] = useState(null);

        useEffect(() => {
            const fetchPrivacySettings = async () => {
                try {
                    const response = await fetch(`/api/privacy-settings/${profile.userId}`);
                    if (!response.ok) {
                        throw new Error("Failed to fetch Privacy Settings");
                    }
                    const ps = await response.json();
                    setPrivacySettings(ps);
                } catch (error) {
                    console.error(error.message);
                }
            };

            if (isOpen) {
                fetchPrivacySettings();
            }
        }, [isOpen, profile.userId]);

        if (!isOpen) return null;

        const handleStartConversation = async () => {
            const { chatSessionId } = await startConversation(profile);
            if (chatSessionId) {
                navigate(`/chat-window/${chatSessionId}`);
            } else {
                console.log("Unable to start conversation")
            }
        }

        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                    <h3>{profile.nickname}</h3>

                    {privacySettings?.firstNameVisible && <h4>Name {profile.firstName}</h4>}
                    {privacySettings?.lastNameVisible && <h4>Lastname {profile.lastName}</h4>}
                    {privacySettings?.emailVisible && <h4>E-mail {profile.email}</h4>}
                    {privacySettings?.phoneNumberVisible && <h4>Phone Number: {profile.phoneNumber} </h4>}

                    <button onClick={handleTestButton}>TEST BUTTON</button>
                    <button onClick={handleStartConversation}>Pošalji Poruku</button>
                    <button className="modal-close-button" onClick={onClose}>Close</button>
                </div>
            </div>
        );
    };

    const openAdModal = useCallback(() => {
        setIsAdModalOpen(true);
    }, []);

    const closeAdModal = useCallback(() => {
        setIsAdModalOpen(false);
    }, []);


    const handleCardClick = () => {
        setIsExpanded(true);
    };


    const handleFileChange = (event) => {
        if (event.target.files[0]) {
            setNewImage(event.target.files[0]);
        }
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
    useEffect(() => {
        const checkOwnership = async () => {
            const nickname = getNicknameFromToken();
            try {
                const response = await fetch(`/api/users/by-nickname/${nickname}`);
                if (response.ok) {
                    var fetchedUserId = await response.json();
                    fetchedUserId = fetchedUserId.userId;
                    console.log(scooter.userId == fetchedUserId);
                    setIsCurrentUserOwner(scooter.user.userId == fetchedUserId);
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        checkOwnership();
    }, [scooter.userId]);

    const determineButtons = () => {
        if (curUser.userId === clientId && status === "RENTED") {
            return [
                { text: 'Vrati', onClick: (e) => handleButtonClick(e, 'vrati') },
                { text: 'Prijavi', onClick: (e) => handleButtonClick(e, 'prijavi') }
            ];
        }
        else if (isCurrentUserOwner) {
            return [
                { text: 'Uredi', onClick: (e) => handleButtonClick(e, 'uredi') },
                { text: 'Izbriši', onClick: (e) => handleButtonClick(e, 'izbrisi') }
            ];
        } else {
            return [
                { text: 'Unajmi', onClick: (e) => handleButtonClick(e, 'unajmi') },
                { text: 'Prijavi', onClick: (e) => handleButtonClick(e, 'prijavi') }
            ];
        }
    };

    const buttons = determineButtons();

    const handleRequest = async () => {
        console.log(listingId);
        try {
            const data = {status:"REQUESTED"}

            const response = await fetch(`/api/listing/update-listing-status/${listingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to update listing status');
            }

            const chatSessionId = await sendMessageWithAction(scooter.user, listingId);
            //navigate(`/chat-window/${chatSessionId}`);
            navigate(`/chat-panel`);


        } catch (error) {
            console.error('Error updating listing status:', error);
        }
    };

    const handleReturn = async () => {
        try {
            const data = {status:"RETURNED"}

            const response = await fetch(`/api/listing/update-listing-status/${listingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            navigate('/home');


            if (!response.ok) {
                throw new Error('Failed to update listing status');
            }

        } catch (error) {
            console.error('Error returning scooter:', error);
        }
    };

    const handleDeleteListing = async () => {
        try {
            const response = await fetch(`/api/listing/delete-listing/${listing.listingId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            console.log('Listing deleted successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const AdModal = ({
                         isOpen, onClose
                     }) => {
        const [localListing, setLocalListing] = useState({...listing});

        useEffect(() => {
            if (isOpen) {
                setLocalListing({
                    ...listing,
                    returnByTime: new Date().toISOString().slice(0, 16) // Postavljanje minimalnog vremena povratka
                });
            }
        }, [isOpen, listing]);

        const handleAdChange = (event) => {
            const {name, value} = event.target;
            setLocalListing({...localListing, [name]: value});
        };
        const handleAdSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await fetch(`/api/listing/edit-listing/${listing.listingId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(localListing),
                });

                if (response.ok) {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const result = await response.json();
                        console.log('Listing updated:', result);
                    } else {
                        const result = await response.text();
                        console.log('Error:', result);
                    }

                    onClose();
                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (!isOpen) return null;
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={handleAdSubmit} className="ad-form">
                        <div className="form-group">
                            <label>Trenutna adresa</label>
                            <input type="text" name="currentAddress" value={localListing.currentAddress}
                                   onChange={handleAdChange}/>
                        </div>
                        <div className="form-group">
                            <label>Adresa povratka</label>
                            <input type="text" name="returnAddress" value={localListing.returnAddress}
                                   onChange={handleAdChange}/>
                        </div>
                        <div className="form-group">
                            <label>Cijena po kilometru</label>
                            <input type="number" step="0.1" name="pricePerKilometer"
                                   value={localListing.pricePerKilometer}
                                   onChange={handleAdChange}/>
                        </div>
                        <div className="form-group">
                            <label>Iznos kazne</label>
                            <input type="number" step="0.1" name="penaltyFee" value={localListing.penaltyFee}
                                   onChange={handleAdChange}/>
                        </div>
                        <div className="form-group">
                            <label>Vrijeme povratka</label>
                            <input
                                type="datetime-local"
                                name="returnByTime"
                                value={localListing.returnByTime}
                                onChange={handleAdChange}
                            />
                        </div>
                        <button type="submit">Spremi</button>
                        <button className="modal-close-button" onClick={onClose}>Zatvori</button>
                    </form>
                </div>
            </div>
        );
    };


    const shareUrl = "window.location.href";

    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`;
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

    return (
        <div className={`scooter ${isExpanded ? 'expanded' : ''}`} onClick={handleCardClick}>
            <img src={ProfileAvatar} alt={"PROFILE"} className="profile-avatar" onClick={(e) => handleViewProfile(e)}
                 style={{cursor: 'pointer'}}/>
            {isExpanded && (
                <div className="modal-overlay" onClick={() => setIsExpanded(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="expanded-content">
                            <img src={imagePath} alt={`${model} Scooter`} className="scooter-image"/>
                            <img src={ProfileAvatar} alt={"PROFILE"} className="profile-avatar" onClick={(e) => handleViewProfile(e)}
                                 style={{cursor: 'pointer'}}/>
                            <div className="scooter-details">
                                <h3>{model}</h3>
                                <p><strong>Brzina:</strong> {maxSpeed} km/h</p>
                                <p><strong>Kapacitet:</strong> {batteryCapacity} kWh</p>
                                <p><strong>Godina Proizvodnje:</strong> {scooter.yearOfManufacture} </p>
                                <p><strong>Dodatne informacije:</strong> {scooter.additionalInformation || "-"}</p>
                                <p><strong>Doseg:</strong> {scooter.maxRange} </p>
                                <p><strong>Trenutna adresa:</strong> {listing.currentAddress} </p>
                                <p><strong>Adresa povratka:</strong> {listing.returnAddress} </p>
                                <p><strong>Cijena po kilometru:</strong> {listing.pricePerKilometer} €/km</p>
                                <p><strong>Kazna:</strong> {listing.penaltyFee} €</p>
                                <p><strong>Vratiti
                                    do:</strong> {format(new Date(listing.returnByTime), 'dd.MM.yyyy HH:mm')}</p>
                            </div>
                            <div className="social-share-buttons">
                                <ul>
                                    <li><a href={facebookShareUrl} target="_blank" rel="noopener noreferrer"><FaFacebook
                                        size={32}/></a></li>
                                    <li><a href={twitterShareUrl} target="_blank" rel="noopener noreferrer"><FaTwitter
                                        size={32}/></a></li>
                                    <li><a href={linkedInShareUrl} target="_blank" rel="noopener noreferrer"><FaLinkedin
                                        size={32}/></a></li>
                                </ul>
                            </div>
                            <div className="scooter-buttons">
                                {buttons.map((button, index) => (
                                    <button key={index} className="scooter-button" onClick={button.onClick}>
                                        {button.text}
                                    </button>
                                ))}
                                <button className="scooter-button" onClick={() => setIsExpanded(false)}>Zatvori</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {!isExpanded && (
                <>
                    <img src={imagePath} alt={`${model} Scooter`} className="scooter-image"/>
                    <div className="scooter-details">
                        <h3>{model}</h3>
                        <p><strong>Brzina:</strong> {maxSpeed} km/h</p>
                        <p><strong>Kapacitet:</strong> {batteryCapacity} kWh</p>
                    </div>
                    <ul className="scooter-buttons">
                        {buttons.map((button, index) => (
                            <li key={index}>
                                <button className="scooter-button" onClick={button.onClick}>
                                    {button.text}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                        {/* File Upload Section */}
                        <div className="imageRequest" style={{display: isVisible ? "block" : "none"}}>
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
                            <button type="submit" >Pošalji zahtjev za zamjenom slike</button>
                        </div>
                    </form>

                </>
            )}

            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                profile={userProfile}
            />
            <AdModal
                isOpen={isAdModalOpen}
                onClose={closeAdModal}
            />

        </div>
    );
}

export default ScooterCard;
