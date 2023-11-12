import React, { useState, useEffect } from 'react';
import './AdminDashboard.css'
import {Link} from "react-router-dom";

function AdminDashboard() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [acceptedUsers, setAcceptedUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [rejectedUsers, setRejectedUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchUsers("http://localhost:8080/api/users/pendingUsers", setPendingUsers);
        fetchUsers("http://localhost:8080/api/users/acceptedUsers", setAcceptedUsers);
        fetchUsers("http://localhost:8080/api/users/admins", setAdmins);
        fetchUsers("http://localhost:8080/api/users/blockedUsers", setBlockedUsers);
        fetchUsers("http://localhost:8080/api/users/rejectedUsers", setRejectedUsers);
    }, []);


    const handleStatusChange = async (userId, status) => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}/update-status`, {
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
                setPendingUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
                const acceptedUser = pendingUsers.find(user => user.userId === userId);
                if (acceptedUser) {
                    setAcceptedUsers(prevUsers => [...prevUsers, { ...acceptedUser, status }]);
                }
            } else if (status === 'REJECTED') {
                const rejectedUser = pendingUsers.find(user => user.userId === userId);
                if (rejectedUser) {
                    // Add the rejected user to the rejectedUsers state
                    setRejectedUsers(prevUsers => [...prevUsers, { ...rejectedUser, status }]);
                    // Then remove the user from the pendingUsers state
                    setPendingUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
                }
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
            const response = await fetch(`http://localhost:8080/api/users/${userId}/update-role`, {
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

    const UserTable = ({ users, category, renderActions, id }) => {
        return (
            <div id={id}>
                <h3>{category}</h3>
                {users.length > 0 ? (
                    <table>
                        <thead>
                        <tr>
                            <th>Nickname</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Role</th>
                            <th>Status</th>
                            {renderActions && <th>Actions</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (
                            <tr key={user.userId}>
                                <td>{user.nickname}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.role}</td>
                                <td>{user.status}</td>
                                <td className="action-buttons">{renderActions && renderActions(user)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No {category.toLowerCase()}.</p>
                )}
            </div>
        );
    };

    const renderPendingActions = (user) => (
        <>
            <button className="approve" onClick={() => handleStatusChange(user.userId, 'ACCEPTED')}>Accept</button>
            <button className="reject" onClick={() => handleStatusChange(user.userId, 'REJECTED')}>Reject</button>
        </>
    );

    const renderAcceptedActions = (user) => (
        <>
            <button className="make-admin" onClick={() => handleRoleChange(user.userId, 'ADMIN')}>Make Admin</button>
            <button className="block" onClick={() => handleStatusChange(user.userId, 'BLOCKED')}>Block User</button>
        </>
    );


    return (


            <div>
                <h1>ADMIN DASHBOARD</h1>
                <div className="adminNavBar">
                    <a href="#pendingUsers">Pending Users</a> |
                    <a href="#acceptedUsers">Accepted Users</a> |
                    <a href="#admins">Admins</a> |
                    <a href="#blockedUsers">Blocked Users</a> |
                    <a href="#rejectedUsers">Rejected Users</a> |
                    <Link to="/admin-dashboard/imageChange">Change Image</Link>
                </div>
                <UserTable users={pendingUsers} category="Pending Users" renderActions={renderPendingActions} id="pendingUsers" />
                <UserTable users={acceptedUsers} category="Accepted Users" renderActions={renderAcceptedActions} id="acceptedUsers"/>
                <UserTable users={admins} category="ADMINS" id="admins"/>
                <UserTable users={blockedUsers} category="BLOCKED USERS" id="blockedUsers"/>
                <UserTable users={rejectedUsers} category="Rejected Users" id="rejectedUsers"/>
            </div>

    );
}

export default AdminDashboard;
