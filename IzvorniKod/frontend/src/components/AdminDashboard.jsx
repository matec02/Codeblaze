import React, {useState, useEffect, useCallback} from 'react';
import './AdminDashboard.css'
import {Link, useNavigate} from "react-router-dom";
import ImageNotFound from '../assets/ImageNotFound.png';
import {getNicknameFromToken} from "./RegisterScooterForm";
import {fetchRequests} from "./ImageChange";

function AdminDashboard() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [acceptedUsers, setAcceptedUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [rejectedUsers, setRejectedUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [pendingRequests, setPendingRequests] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(true);
    const [currentImageSrc, setCurrentImageSrc] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers("/api/users/pendingUsers", setPendingUsers);
        fetchUsers("/api/users/acceptedUsers", setAcceptedUsers);
        fetchUsers("/api/users/admins", setAdmins);
        fetchUsers("/api/users/blockedUsers", setBlockedUsers);
        fetchUsers("/api/users/rejectedUsers", setRejectedUsers);
        fetchRequests("api/imageChangeRequest/pendingRequests", setPendingRequests);
        handleDocument();

    }, []);

    const openModal = useCallback((imageSrc) => {
        setCurrentImageSrc(imageSrc);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleDocument = async () => {
        try {
            const response = await fetch(`/api/documents/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setDocuments(data);

        } catch (error) {
            console.error("Failed to fetch documents: ", error);
        }
    };

    const handleStatusChange = async (userId, status) => {
        try {
            const response = await fetch(`/api/users/${userId}/update-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: status })
            });


            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            if (status === 'ACCEPTED') {
                let role = 'USER'
                handleRoleChange(userId, role);
                setPendingUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
                setBlockedUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
                const acceptedUser = pendingUsers.find(user => user.userId === userId) || blockedUsers.find(user => user.userId === userId);
                if (acceptedUser) {
                    setAcceptedUsers(prevUsers => [...prevUsers, { ...acceptedUser, status, role: role }]);
                }
            } else if (status === 'REJECTED') {
                await fetchUsers("/api/users/blockedUsers", setBlockedUsers);
            } else if (status === 'BLOCKED') {
                setAcceptedUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
                const blockedUser = acceptedUsers.find(user => user.userId === userId);
                if (blockedUser) {
                    setBlockedUsers(prevUsers => [...prevUsers, { ...blockedUser, status }]);
                }
            }

        } catch (error) {
            console.error('Error updating status in updating status:', error);
        }
    };

    const handleRoleChange = async (userId, role) => {
        try {
            const response = await fetch(`/api/users/${userId}/update-role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: role })
            });


            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            if (role === 'ADMIN') {
                const adminUser = acceptedUsers.find(user => user.userId === userId);
                if (adminUser) {
                    // Add to admins list
                    setAdmins(prevAdmins => [...prevAdmins, { ...adminUser, role }]);
                    // Remove from accepted users list
                    setAcceptedUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
                }
            } else if ( role === 'USER') {
                const User = admins.find(user => user.userId === userId);
                if (User) {
                    // Add to admins list
                    setAcceptedUsers(prevAccepted => [...prevAccepted, { ...User, role }]);
                    // Remove from accepted users list
                    setAdmins(prevUsers => prevUsers.filter(user => user.userId !== userId));
                }
            }


        } catch (error) {
            console.error('Error updating role in updating status:', error);
        }
    };

    const fetchUsers = async (url, setState) => {
        setErrorMessage(''); // Resetting the error message

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error in AdminDashboard: ${response.status}`);
            }


            const data = await response.json();
            setState(data); // Setting the state with the fetched data

        } catch (error) {
            console.error("Failed to fetch users: ", error);
            setErrorMessage(error.message);
        }
    };

    const UserTable = ({ users, category, renderActions, id, documents }) => {
        return (
            <div id={id}>
                <h3>{category}</h3>
                {users.length > 0 ? (
                    <table>
                        <thead>
                        <tr>
                            <th>Nadimak</th>
                            <th>Ime</th>
                            <th>Prezime</th>
                            <th>Email</th>
                            <th>Broj mobitela</th>
                            <th>Tip korisnika</th>
                            <th>Status</th>
                            <th>Slika potvrde o nekažnjavanju</th>
                            <th>Slika osobne iskaznice</th>
                            {renderActions && <th>Radnje</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => {
                            // Find the document for the current user
                            const document = documents.find(doc => doc.user.userId === user.userId);
                            return (
                                <tr key={user.userId}>
                                    <td>{user.nickname}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phoneNumber}</td>
                                    <td>{user.role}</td>
                                    <td>{user.status}</td>
                                    <td className="user-table-action-buttons">
                                        <button className="user-table-button" onClick={() => openModal(document?.pathCriminalRecord || ImageNotFound)}>Prikaži sliku potvrde</button>
                                    </td>
                                    <td className="user-table-action-buttons">
                                        <button  className="user-table-button" onClick={() => openModal(document?.pathIdentification || ImageNotFound)}>Prikaži sliku iskaznice</button>
                                    </td>
                                    <td className="action-buttons">{renderActions && renderActions(user)}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                ) : (
                    <p>No {category.toLowerCase()}.</p>
                )}
            </div>
        );
    };

    const ImageModal = ({ isOpen, onClose, imageSrc, altText }) => {
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

    const TaskModal = ({ isOpen, onClose, pendingRequests, pendingUsers }) => {
        const renderMessage = () => {
            if (pendingUsers.length > 0 && pendingRequests.length > 0) {
                return (
                    <p>
                        Imate <span className="highlighted-text">{pendingUsers.length} korisnika na čekanju</span> i
                        <span className="highlighted-text"> {pendingRequests.length} zahtjeva za promjenu slike na čekanju</span>.
                    </p>
                );
            } else if (pendingUsers.length > 0) {
                return (
                    <p>
                        Imate <span className="highlighted-text">{pendingUsers.length} korisnika na čekanju</span>.
                    </p>
                );
            } else if (pendingRequests.length > 0) {
                return (
                    <p>
                        Imate <span className="highlighted-text">{pendingRequests.length} zahtjeva za promjenu slike na čekanju</span>.
                    </p>
                );
            } else {
                return <p>Nemate zadatke na čekanju</p>;
            }
        };

        return isOpen && (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="message-container">
                        {renderMessage()}
                    </div>
                    <div className="action-buttons">
                    {(pendingUsers.length > 0) &&
                        (<button className="taskButton" onClick={onClose}>
                            Korisnici na čekanju
                        </button>)}
                    {(pendingRequests.length > 0) &&
                        (<button className="taskButton" onClick={() => navigate('/imageChangeRequests')}>
                            Zahtjevi za zamjenu slika
                        </button>)}
                    </div>
                    <button className="reject" onClick={onClose}>Zatvori</button>
                </div>
            </div>
        );
    };



    const renderPendingActions = (user) => (
        <>
            <button className="approve" onClick={() => handleStatusChange(user.userId, 'ACCEPTED')}>Prihvati</button>
            <button className="reject" onClick={() => handleStatusChange(user.userId, 'REJECTED')}>Odbij</button>
        </>
    );

    const renderAcceptedActions = (user) => (
        <>
            <button className="make-admin" onClick={() => handleRoleChange(user.userId, 'ADMIN')}>Pretvori u administratora</button>
            <button className="block" onClick={() => handleStatusChange(user.userId, 'BLOCKED')}>Blokiraj korisnika</button>
        </>
    );

    const removeAdmin = (user) => {
        // Assuming getNicknameFromToken() gets the nickname of the currently logged-in user
        const currentUserNickname = getNicknameFromToken();

        return (
            <>
                {(user.nickname !== currentUserNickname && user.nickname !== "admin") ? (
                    <button className="block" onClick={() => handleRoleChange(user.userId, 'USER')}>
                        Ukloni administratora
                    </button>
                ):(<span>Nema mogućih radnji</span>)
                }
            </>
        );
    };

    const unblockUser = (user) => (
        <>
            <button className="make-admin" onClick={() => handleStatusChange(user.userId, 'ACCEPTED')}>Odblokiraj korisnika</button>
        </>
    );


    return (
        <div>
            <h1>PANEL ZA ADMINA</h1>
            <div className="adminNavBar">
                <a href="#pendingUsers">Korisnici na čekanju ({pendingUsers.length})</a>
                <a href="#acceptedUsers">Prihvaćeni korisnici</a>
                <a href="#admins">Adminstratori</a>
                <a href="#blockedUsers">Blokirani korisnici</a>
                <a href="#rejectedUsers">Odbijeni korisnici</a>
                <Link to="/imageChangeRequests">Promjena Slike ({pendingRequests.length})</Link>
            </div>

                <>
                    <UserTable users={pendingUsers} category="Korisnici na čekanju" renderActions={renderPendingActions} id="pendingUsers" documents={documents}/>
                    <UserTable users={acceptedUsers} category="Prihvaćeni korisnici" renderActions={renderAcceptedActions} id="acceptedUsers" documents={documents}/>
                    <UserTable users={admins} category="Administratori" id="admins" renderActions={removeAdmin} documents={documents}/>
                    <UserTable users={blockedUsers} category="Blokirani korisnici" id="blockedUsers" renderActions={unblockUser} documents={documents}/>
                    <UserTable users={rejectedUsers} category="Odbijeni korisnici" id="rejectedUsers" documents={documents}/>
                </>

            <ImageModal
                isOpen={isModalOpen}
                onClose={closeModal}
                imageSrc={currentImageSrc}
                altText="Document Image"
            />
            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                pendingRequests={pendingRequests}
                pendingUsers={pendingUsers}
            />
        </div>
    );

}

export default AdminDashboard;
