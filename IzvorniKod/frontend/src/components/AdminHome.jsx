import React, { useState } from "react";
import {useNavigate} from 'react-router-dom';
function AdminHome() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Select option for Admin</h2>
            <div className="tabs">
                <button onClick={() => navigate("/")}>
                    BACK TO HOME PAGE
                </button>
                <button onClick={() => navigate('/admin-dashboard')}>
                    ADMIN DASHBOARD
                </button>
            </div>
        </div>
    );
}

export default AdminHome;
