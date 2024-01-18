import React, {useCallback, useState, useEffect} from 'react';
import './ScooterCard.css'
import {useNavigate} from "react-router-dom";
import {getNicknameFromToken} from "./RegisterScooterForm";


function ScooterCardHome({ scooter }) {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [currentImageSrc, setCurrentImageSrc] = useState('');
    const [NotificationScooterDelete, setNotificationScooterDelete] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCurrentUserOwner, setIsCurrentUserOwner] = useState(false);
    const [isAdModalOpen, setIsAdModalOpen] = useState(false);
    const [newImage, setNewImage] = useState('');
    const [comments, setComments] = useState({
        comments: ''
    });
    const [listing, setListing] = useState({
        currentAddress: '',
        returnAddress: '',
        pricePerKilometer: '',
        penaltyFee: '',
        returnByTime: ''
    });

    const { userId, scooterId, imagePath, model, maxSpeed,
        batteryCapacity, yearOfManufacture, additionalInformation, deleted } = scooter;

    const handleButtonClick = (event, action) => {
        event.stopPropagation();
        if (action === 'uredi') {
            openEditModal();
        } else if (action === 'oglasi') {
            openAdModal();
        } else if (action == 'izbrisi') {
            handleDeleteScooter();
        }
    };

    const openEditModal = useCallback(() => {
        setIsEditModalOpen(true);
    }, []);

    const closeEditModal = useCallback(() => {
        setIsEditModalOpen(false);
    }, []);

    const openImageModal = useCallback((imageSrc) => {
        setCurrentImageSrc(imageSrc);
        setIsImageOpen(true);
    }, []);

    const closeImageModal = useCallback(() => {
        setIsImageOpen(false);
    }, []);

    const openAdModal = useCallback(() => {
        setListing(prevListing => ({
            ...prevListing,
            returnByTime: toLocalDateTime(new Date())
        }));
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

    useEffect(() => {
        if (NotificationScooterDelete) {

            const timer = setTimeout(() => {
                setNotificationScooterDelete(false);
            }, 4500);

            return () => clearTimeout(timer);
        }
    }, [NotificationScooterDelete]);

    const handleUpdateScooter = async (updatedScooter) => {
        try {
            const response = await fetch(`/api/scooters/edited-scooter/${scooterId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedScooter),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            window.location.reload();
            const result = await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleDeleteScooter = async () => {
        try {
            const response = await fetch(`/api/scooters/${scooterId}/updateIsDeleted`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isDeleted: true })
            });

            if (response.status === 409) {
                setNotificationScooterDelete(true);
                return;
            }

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            window.location.reload();

        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Failed to delete scooter.');
        }
    };

    const buttons = [
        { text: 'Oglasi', onClick: (e) => handleButtonClick(e, 'oglasi') },
        { text: 'Uredi', onClick: (e) => handleButtonClick(e, 'uredi') },
        { text: 'Izbriši', onClick: (e) => handleButtonClick(e, 'izbrisi') }
    ];


    const AdModal = ({ isOpen, onClose }) => {
        const [localListing, setLocalListing] = useState({ ...listing });

        useEffect(() => {
            if (isOpen) {
                setLocalListing({
                    ...listing,
                    returnByTime: toLocalDateTime(new Date())
                });
            }
        }, [isOpen]);

        const handleAdChange = (event) => {
            const { name, value } = event.target;
            setLocalListing({ ...localListing, [name]: value });
        };

        const handleAdSubmit = async (event) => {
            event.preventDefault();
            const data = {
                ...localListing,
                scooterData: scooter
            };
            try {
                const response = await fetch(`/api/scooters/update-availability/${scooterId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const result = await response.json();
                    } else {
                        const result = await response.text();
                        console.error('Non-JSON response:', result);
                    }

                    onClose();
                } else {
                    console.error('Error while saving:', response.statusText);
                }
                navigate('/home');
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
                            <input type="text" className="listing-form" name="currentAddress"
                                   value={localListing.currentAddress}
                                   onChange={handleAdChange}
                                   placeholder="Upišite trenutnu adresu romobila" required/>
                        </div>
                        <div className="form-group">
                            <label>Adresa povratka</label>
                            <input type="text" className="listing-form" name="returnAddress"
                                   placeholder="Upišite adresu povratka romobila"
                                   value={localListing.returnAddress}
                                   onChange={handleAdChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Cijena po kilometru</label>
                            <input type="number" step="0.1" name="pricePerKilometer"
                                   value={localListing.pricePerKilometer}
                                   className="listing-form"
                                   placeholder="Upišite cijenu po kilometru vožnje"
                                   onChange={handleAdChange} min="0.1" required/>
                        </div>
                        <div className="form-group">
                            <label>Iznos kazne</label>
                            <input type="number" step="0.1" name="penaltyFee"
                                   value={localListing.penaltyFee}
                                   placeholder="Upišite iznos kazne za prekoračenje vremena vraćanja"
                                   className="listing-form" min="0"
                                   onChange={handleAdChange} required/>
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
                        <button type="submit">Oglasi</button>
                        <button className="modal-close-button" onClick={onClose}>Zatvori</button>
                    </form>
                </div>
            </div>
        );
    };

    function EditScooterModal({ isOpen, onClose, scooter, onUpdate }) {
        const [editedScooter, setEditedScooter] = useState(scooter);

        useEffect(() => {
            if (isOpen) {
                setEditedScooter(scooter);
            }
        }, [isOpen, scooter]);

        const handleChange = (event) => {
            const { name, value } = event.target;
            setEditedScooter(prevScooter => ({
                ...prevScooter,
                [name]: value
            }));
        };


        const handleSubmit = async (event) => {
            event.preventDefault();
            await onUpdate(editedScooter);
            onClose();
        };

        if (!isOpen) return null;

        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={handleSubmit} className="ad-form">
                        <div className="form-group">
                            <label>Proizvođač</label>
                            <input type="text" name="manufacturer" value={editedScooter.manufacturer}
                                   onChange={handleChange} placeholder="Upišite ime proizvođača romobila"
                            required/>
                        </div>
                        <div className="form-group">
                            <label>Model</label>
                            <input type="text" name="model" value={editedScooter.model}
                                   onChange={handleChange}
                                   placeholder="Upišite model romobila"
                                   required/>
                        </div>
                        <div className="form-group">
                            <label>Kapacitet baterije</label>
                            <input type="number" name="batteryCapacity" value={editedScooter.batteryCapacity}
                                   min="0" required
                                   onChange={handleChange} placeholder="Upišite maksimalnu brzinu romobila u km/h"/>
                        </div>
                        <div className="form-group">
                            <label>Maksimalna brzina</label>
                            <input type="number" name="maxSpeed" value={editedScooter.maxSpeed}
                                   onChange={handleChange} placeholder="Upišite maksimalnu brzinu romobila u km/h"
                            required min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label>Maksimalni domet</label>
                            <input type="number" step="0.1" name="maxRange" value={editedScooter.maxRange}
                                   onChange={handleChange} placeholder="Upišite maksimalni domet romobila"
                                    min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label>Godina proizvodnje</label>
                            <input type="number" name="yearOfManufacture" value={editedScooter.yearOfManufacture}
                                   min="2000"
                                   max={new Date().getFullYear()}
                                   onChange={handleChange} placeholder="Upišite godinu proizvodnje romobila"/>
                        </div>
                        <div className="form-group">
                            <label>Dodatne informacije</label>
                            <textarea name="additionalInformation" value={editedScooter.additionalInformation}
                                      onChange={handleChange} placeholder="Upišite dodatne informacije o romobilu"
                                      style={{ width: '100%',
                                          height: '60px',
                                          resize: 'none'
                                      }}/>
                        </div>
                        <button type="submit">Spremi</button>
                        <button className="modal-close-button" onClick={onClose}>Zatvori</button>
                    </form>
                </div>
            </div>
        );
    }


    if (!isCurrentUserOwner) {
        return null;
    }
    return (
        <div className={`scooter ${isExpanded ? 'expanded' : ''}`} onClick={isExpanded ? undefined : handleCardClick}>
            {isExpanded && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="expanded-content">
                            <img src={imagePath} alt={`${model} Scooter`} className="scooter-image"/>
                            <div className="scooter-details">
                                <h3>{model}</h3>
                                <p><strong>Brzina:</strong> {maxSpeed} km/h</p>
                                <p><strong>Kapacitet:</strong> {batteryCapacity} kWh</p>
                                <p><strong>Godina Proizvodnje:</strong> {yearOfManufacture} </p>
                                <p><strong>Dodatne informacije:</strong> {additionalInformation} </p>
                                <p><strong>Doseg:</strong> {scooter.maxRange} </p>
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
            {!isExpanded && !deleted &&(
                <>
                    <div className="image-container">
                        <img src={imagePath} alt={`${model} Scooter`} className="scooter-image"/>
                    </div>
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
                </>
            )}
            {NotificationScooterDelete && (
                <div className="notification-bubble" id="red-notification">
                    Ne možete izbrisati romobil koji je trenutno u najmu!
                </div>
            )}
            <ImageModal
                isOpen={isImageOpen}
                onClose={closeImageModal}
                imageSrc={currentImageSrc}
                altText="Romobil"
            />
            <AdModal
                isOpen={isAdModalOpen}
                onClose={closeAdModal}
            />
            <EditScooterModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                scooter={scooter}
                onUpdate={handleUpdateScooter}
            />
        </div>
    );

}

export default ScooterCardHome;
