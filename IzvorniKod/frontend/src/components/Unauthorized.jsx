import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="unauthorized-container">
            <h1 className="unauthorized-header">Access Denied</h1>
            <p className="unauthorized-text">You do not have permission to view this page.</p>
            <button className="unauthorized-button" onClick={() => navigate('/')}>
                Return to Home
            </button>
        </div>
    );
};

export default Unauthorized;
