import React, {useCallback, useState, useEffect} from 'react';
import './ScooterCard.css'
import {Form, useNavigate} from "react-router-dom";
import ProfileAvatar from '../assets/profile-avatar.png';
import {getNicknameFromToken} from "./RegisterScooterForm";
import {format} from 'date-fns';
import {handleEndOfTransactionMessage, sendMessageResponse, sendMessageWithAction, startConversation} from "../utils/MessageUtils";
import {FaFacebook, FaTwitter, FaLinkedin} from 'react-icons/fa';
import {startTransaction} from "./Transactions";
import {sendMessageFromCodeblazeWithAction} from "../utils/MessageUtils";
import { useLocation } from "react-router-dom";

export const ProfileModal = ({isOpen, onClose, profile}) => {
    const [privacySettings, setPrivacySettings] = useState(null);
    const [averageRating, setAverageRating] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (profile.userId) {
            fetch(`/api/reviews/average-rating/${profile.userId}`)
                .then(response => response.json())
                .then(data => {
                    setAverageRating(data);
                })
                .catch(error => {
                    console.error('Error fetching average rating:', error);
                });
        }
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

    const formatRating = (rating) => {
        const numRating = typeof rating === 'number' ? rating : parseFloat(rating);
        return !isNaN(numRating) ? numRating.toFixed(2) : "-";
    };


    const handleStartConversation = async () => {
        const {chatSessionId} = await startConversation(profile);
        if (chatSessionId) {
            navigate(`/chat-window/${chatSessionId}`);
        } else {
            console.log("Error while starting conversation");
        }
    }

    const handleOnRating = async() => {
        navigate(`/reviews/user/${profile.userId}`);
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                <h3>
                    {profile.nickname}
                    <span className="average-rating">
        {averageRating !== null ? ` ( ${formatRating(averageRating)} )` : ''}
    </span>
                </h3>


                {privacySettings?.firstNameVisible && <h4>Name {profile.firstName}</h4>}
                {privacySettings?.lastNameVisible && <h4>Lastname {profile.lastName}</h4>}
                {privacySettings?.emailVisible && <h4>E-mail {profile.email}</h4>}
                {privacySettings?.phoneNumberVisible && <h4>Phone Number: {profile.phoneNumber} </h4>}
                <button onClick={handleStartConversation}>Pošalji Poruku</button>
                <button onClick={handleOnRating}>Recenzije</button>
                <button className="modal-close-button" onClick={onClose}>Zatvori</button>
            </div>
        </div>
    );
};
export const handleImagePathChange = async (scooterId, imagePath) => {
    try {
        const response = await fetch(`/api/scooters/${scooterId}/updateImagePath`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"imagePath": imagePath})
        });


        if (!response.ok) {
            throw new Error('Failed to update image path');
        }

    } catch (error) {
        console.error('Error updating imagePath in updating status:', error);
    }
};

function ScooterCard({listing}) {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [comments, setComments] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [userProfile, setUserProfile] = useState('');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [curUser, setCurUser] = useState('');
    const [isCurrentUserOwner, setIsCurrentUserOwner] = useState(false);
    const [isAdModalOpen, setIsAdModalOpen] = useState(false);
    const [allRequests, setAllRequests] = useState([]);
    const [NotificationImageChange, setNotificationImageChange] = useState(false);
    const [NotificationLogin, setNotificationLogin] = useState(false);
    const [isButtonForBadChangeHidden, setIsButtonForBadChangeHidden] = useState(false);

    const location = useLocation();
    const currentPath = location.pathname;


    const {scooter, user, status, listingId} = listing;
    const {userId, scooterId, imagePath, model, maxSpeed, batteryCapacity} = scooter;

    useEffect(() => {
        handleUser();
        handleAllRequests();
    }, []);

    useEffect(() => {
        if (NotificationImageChange) {
            // Set a timer to hide the notification
            const timer = setTimeout(() => {
                setNotificationImageChange(false);
            }, 3000); // Change 5000 to however many milliseconds you want the notification to show

            // Clear the timer if the component unmounts
            return () => clearTimeout(timer);
        }
    }, [NotificationImageChange]);

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

    const handleAllRequests = async () => {
        try {
            const response = await fetch(`/api/imageChangeRequest/getAll`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setAllRequests(data);

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
        } else if (action === 'losaZamjena') {
            handleRequestStatusChange(listing);
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


    const openAdModal = useCallback(() => {
        setIsAdModalOpen(true);
    }, []);

    const closeAdModal = useCallback(() => {
        setIsAdModalOpen(false);
    }, []);


    const handleCardClick = () => {
        setIsExpanded(true);
    };
    function toLocalDateTime(date) {
        const offset = date.getTimezoneOffset();
        const localTime = new Date(date.getTime() - offset * 60000);
        return localTime.toISOString().slice(0, 16);
    }


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
                const dateTimeString = currentDateTime.toISOString();

                const newImageFormData = new FormData();
                newImageFormData.append('listingId', new Blob([JSON.stringify(listing.listingId)], {type: "application/json"}));
                newImageFormData.append('complaintTime', dateTimeString);
                newImageFormData.append('photoUrlOldImage', new Blob([JSON.stringify(imagePath)], {type: "application/json"}));
                newImageFormData.append('additionalComments', new Blob([JSON.stringify(comments)], {type: "application/json"}))
                newImageFormData.append('photoUrlNewImage', new Blob([JSON.stringify(photoUrlNewImage)], {type: "application/json"}));
                newImageFormData.append('user', new Blob([JSON.stringify(user)], {type: "application/json"}));

                const newImageResponse = await fetch('/api/imageChangeRequest/send', {
                    method: 'POST',
                    body: newImageFormData,
                });

                if (newImageResponse.ok) {
                    const result = await newImageResponse.json();
                    setNewImage(null);
                    await sendMessageFromCodeblazeWithAction(listing.scooter.user, listing, comments);
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
                    setIsCurrentUserOwner(scooter.user.userId == fetchedUserId);
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        checkOwnership();
    }, [scooter.userId]);

    const determineButtons = () => {
        if (user && user.userId && curUser.userId && curUser.userId === user.userId && status === "RENTED") {
            return [
                {text: 'Vrati', onClick: (e) => handleButtonClick(e, 'vrati')},
                {text: 'Zamjeni sliku', onClick: (e) => handleButtonClick(e, 'prijavi')}
            ];
        } else if (isCurrentUserOwner) {
            let actions = []; // Initialize actions here to make it available in the entire block
            let isListingRequestedForImageChange = allRequests.some(request =>
                request.listing.listingId === listing.listingId && request.status === "REQUESTED");

            if (currentPath !== "/my-transactions") {
                actions = [
                    {text: 'Uredi', onClick: (e) => handleButtonClick(e, 'uredi')},
                    {text: 'Izbriši', onClick: (e) => handleButtonClick(e, 'izbrisi')},
                ];
            }

            if (isListingRequestedForImageChange) {
                actions.push({
                    text: 'Prijava loše zamjene slike',
                    onClick: (e) => handleButtonClick(e, 'losaZamjena')
                });
            }

            return actions;
        } else {
            let tokenExists = localStorage.getItem("authToken");
            if (tokenExists) {
                return [
                    {text: 'Unajmi', onClick: (e) => handleButtonClick(e, 'unajmi')},
                    {text: 'Zamjeni sliku', onClick: (e) => handleButtonClick(e, 'prijavi')}
                ];
            } else {
                const handleLoginClick = (e) => {
                    e.stopPropagation();  // Stop the event from bubbling up
                    setNotificationLogin(true);
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                };
                return [
                    { text: 'Unajmi', onClick: (e) => handleLoginClick(e)},
                    { text: 'Zamjeni sliku', onClick: (e) => handleLoginClick(e) }
                ];
            }
        }
    };


    const buttons = determineButtons();

    const handleRequest = async () => {
        try {
            const data = {status: "REQUESTED"}

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

            const chatSessionId = await sendMessageWithAction(scooter.user, listingId, scooter.manufacturer, scooter.model, scooter.yearOfManufacture);
            //navigate(`/chat-window/${chatSessionId}`);
            navigate(`/chat-panel`);

        } catch (error) {
            console.error('Error updating listing status:', error);
        }
    };

    const handleReturn = async () => {
        try {
            const data = {status: "RETURNED"}

            const response = await fetch(`/api/listing/update-listing-status/${listingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const listingPricePerKm = listing.pricePerKilometer;
            const owner = scooter.user;
            const client = listing.user;
            const returnByTime = listing.returnByTime;
            const penaltyFee = listing.penaltyFee;

            const transactionId = await startTransaction(owner, client, listingPricePerKm,
                returnByTime, penaltyFee, listing.listingId);

            await handleEndOfTransactionMessage(owner.userId, client.userId, transactionId);

            navigate('/my-transactions');


            if (!response.ok) {
                throw new Error('Failed to update listing status');
            }

        } catch (error) {
            console.error('Error returning scooter:', error);
        }
    };

    const handleRequestStatusChange = async (listing) => {
        try {
            let matchingRequest = allRequests.find(request => request.listing.listingId === listing.listingId
                && request.status == 'REQUESTED');
            const response = await fetch (`/api/imageChangeRequest/update-status/${matchingRequest.imageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'PENDING' })
            });

            if (!response.ok) {
                throw new Error('Failed to change status of request')
            }
            setNotificationImageChange(true);
            setIsButtonForBadChangeHidden(true)
        } catch (error) {
            console.error("Failed Api for image change status: ", error)
        }

    };

    const handleDeleteListing = async () => {
        try {
            const data = {status: "REQUESTED"}

            const response = await fetch(`/api/listing/update-listing-status/${listingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
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
                    returnByTime: toLocalDateTime(new Date())
                });
            }
        }, [isOpen]);

        const handleAdChange = (event) => {
            const {name, value} = event.target;
            const dateTime = new Date(localListing.returnByTime);
            const formattedDateTime = dateTime.toISOString().split('.')[0];
            setLocalListing({...localListing,
                listingTime: formattedDateTime,
                [name]: value});
        };
        const handleAdSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await fetch(`/api/listing/edit-listing/${listing.listingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(localListing),
                });

                if (response.ok) {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const result = await response.json();
                    } else {
                        const result = await response.text();
                    }
                    onClose();
                    window.location.reload()
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
                                   onChange={handleAdChange}
                                   placeholder="Upišite trenutnu adresu romobila" required />
                        </div>
                        <div className="form-group">
                            <label>Adresa povratka</label>
                            <input type="text" name="returnAddress" value={localListing.returnAddress}
                                   placeholder="Upišite adresu povratka romobila"
                                   onChange={handleAdChange} required />
                        </div>
                        <div className="form-group">
                            <label>Cijena po kilometru</label>
                            <input type="number" step="0.1" name="pricePerKilometer"
                                   placeholder="Upišite cijenu po kilometru vožnje"
                                   value={localListing.pricePerKilometer}
                                   onChange={handleAdChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Iznos kazne</label>
                            <input type="number" step="0.1" name="penaltyFee" value={localListing.penaltyFee}
                                   placeholder="Upišite iznos kazne za prekoračenje vremena vraćanja"
                                   onChange={handleAdChange}
                                   required/>
                        </div>
                        <div className="form-group">
                            <label>Vrijeme povratka</label>
                            <input
                                type="datetime-local"
                                name="returnByTime"
                                value={localListing.returnByTime}
                                onChange={handleAdChange}
                                className="listing-form"
                                min={localListing.returnByTime}
                                required
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
            <div className="image-container">
                <img src={ProfileAvatar} alt={"PROFILE"} className="profile-avatar"
                     onClick={(e) => handleViewProfile(e)}
                     style={{cursor: 'pointer'}}/>
                    <span className="tooltip-text" id="profile-avatar-hover">Pogledaj profil iznajmljivača
                    </span>
            </div>
            <div className="renter-nickname" style={{ cursor: 'pointer', marginBottom: '8px' }}
                 onClick={(e) => handleViewProfile(e)}>
                {scooter.user.nickname}
            </div>
            {isExpanded && (
                <div className="modal-overlay" onClick={() => setIsExpanded(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="expanded-content">

                                <img src={imagePath} alt={`${model} Scooter`} className="scooter-image"
                                     style={{paddingBottom: '5%'}}/>


                            <div className="image-container">
                                <img src={ProfileAvatar} alt={"PROFILE"} className="profile-avatar"
                                     onClick={(e) => handleViewProfile(e)}
                                     style={{cursor: 'pointer'}}/>
                                <span className="tooltip-text" id="profile-avatar-hover">Pogledaj profil iznajmljivača
                    </span>
                            </div>
                            <div className="renter-nickname" onClick={(e) => handleViewProfile(e)}>
                                {scooter.user.nickname}
                            </div>
                            <div className="scooter-details">
                                <h3>{model}</h3>
                                <p><strong>Brzina:</strong> {maxSpeed} km/h</p>
                                <p><strong>Kapacitet:</strong> {batteryCapacity} kWh</p>
                                <p><strong>Godina Proizvodnje:</strong> {scooter.yearOfManufacture || "Trenutačno nepoznato"} </p>
                                <p><strong>Dodatne informacije:</strong> {scooter.additionalInformation || "Trenutačno nepoznato"}</p>
                                <p><strong>Doseg:</strong> {(scooter.maxRange + " km") || "Trenutačno nepoznato"} </p>
                                <p><strong>Trenutna adresa:</strong> {listing.currentAddress} </p>
                                <p><strong>Adresa povratka:</strong> {listing.returnAddress} </p>
                                <p><strong>Cijena po kilometru:</strong> {listing.pricePerKilometer} €/km</p>
                                <p><strong>Kazna:</strong> {listing.penaltyFee} €</p>
                                <p><strong>Vratiti
                                    do:</strong> {format(new Date(listing.returnByTime),
                                    'HH:mm dd.MM.yyyy')}</p>
                            </div>
                            {isCurrentUserOwner && (
                                <div className="social-share-buttons">
                                    <ul>
                                        <li><a href={facebookShareUrl} target="_blank"
                                               rel="noopener noreferrer"><FaFacebook
                                            size={32}/></a></li>
                                        <li><a href={twitterShareUrl} target="_blank"
                                               rel="noopener noreferrer"><FaTwitter
                                            size={32}/></a></li>
                                        <li><a href={linkedInShareUrl} target="_blank"
                                               rel="noopener noreferrer"><FaLinkedin
                                            size={32}/></a></li>
                                    </ul>
                                </div>
                            )}
                            <div className="scooter-buttons">
                                {buttons && (buttons.map((button, index) => (
                                    <button key={index} className="scooter-button" onClick={button.onClick}>
                                        {button.text}
                                    </button>
                                )))}
                                <button className="scooter-button" onClick={() => setIsExpanded(false)}>Zatvori</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {!isExpanded && (
                <>
                    <div className="image-container">
                        <img src={imagePath} alt={`${model} Scooter`} className="scooter-image"
                             style={{paddingBottom: '5%'}}/>
                        <span className="tooltip-text">Klikni za detalje i<br/> uvjete najma</span>
                    </div>
                    <div className="scooter-details">
                        <h3>{model}</h3>
                        <p><strong>Brzina:</strong> {maxSpeed} km/h</p>
                        <p><strong>Kapacitet:</strong> {batteryCapacity} kWh</p>
                    </div>
                    <ul className="scooter-buttons">
                        {buttons.map((button, index) => (
                            <li key={index}>
                                <button
                                    className="scooter-button"
                                    onClick={button.onClick}
                                    style={button.text === "Prijava loše zamjene slike"
                                        ? { display: isButtonForBadChangeHidden ? "none" : "block" } : {}}
                                >
                                    {button.text}
                                </button>
                            </li>
                        ))}
                    </ul>
                    {NotificationImageChange && (
                        <div className="notification-bubble">
                            Vaša primjedba za lošu zamjenu slike je poslana. <br/> Pričekajte odluku administratora!
                        </div>
                    )}
                    {NotificationLogin && (
                        <div className="notification-bubble" id="red-notification">
                            Prije unajmljivanja romobila se morate prijaviti ili registrirati!
                        </div>
                    )}
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
                                    <textarea
                                        name="comments"
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                        style={{ width: '85%',
                                            height: '80px',
                                            resize: 'none'
                                        }}
                                        placeholder="Upišite razlog za zamjenu slike"
                                    />
                                </label>
                            </div>
                            <div>
                                <button className="scooter-button" onClick={() => setIsVisible(false)}
                                        style={{marginTop: '0px'}}>Zatvori</button>
                            </div>
                            <button type="submit" style={{marginBottom: '15px', marginTop: '10px'}}>Potvrdi zamjenu</button>
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
