import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

import Home from './components/Home';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import ProfilePending from './components/ProfilePending';
import ProfileBlocked from './components/ProfileBlocked';
import MyScooter from './components/MyScooter';
import RegisterScooterForm from './components/RegisterScooterForm';
import NavBar from "./components/NavBar";
import AdminHome from "./components/AdminHome";
import AdminDashboard from "./components/AdminDashboard";
import ImageChange from "./components/ImageChange";

import AdminRoute from "./components/AdminRoute";
import ProtectedRoutes from "./components/ProtectedRoutes"
import Unauthorized from "./components/Unauthorized";

/* Import for ScooterCard test
import ScooterCard from "./components/ScooterCard";*/

function App() {
    return (
        <Router>
            <header>
                <NavBar/>
            </header>
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/login" element={<LoginForm/>}/>
                <Route path="/register" element={<RegisterForm/>}/>

                <Route path="/profile-pending" element={
                    <ProfilePending />
                }/>
                <Route path="/profile-blocked" element={
                    <ProfileBlocked />
                }/>
                <Route path="/scooters" element={
                    <ProtectedRoutes>
                        <MyScooter />
                    </ProtectedRoutes>
                }/>
                <Route path="/add-scooter" element={
                    <ProtectedRoutes>
                        <RegisterScooterForm />
                    </ProtectedRoutes>
                }/>
                <Route path="/admin-home" element={
                    <AdminRoute>
                        <AdminHome />
                    </AdminRoute>
                } />
                <Route path="/admin-dashboard" element={
                    <AdminRoute>
                        <AdminDashboard/>
                    </AdminRoute>
                }/>
                <Route path="/admin-dashboard/imageChange" element={
                    <AdminRoute>
                        <ImageChange/>
                    </AdminRoute>
                }/>
                <Route path="/unauthorized" element={
                    <Unauthorized/>
                }/>
                {/* Test for just 1 ScooterCard - uncomment import and route to test
                <Route path="/scooter" element={<ScooterCard/>}/>
                */}


                {/* TODO add all possible routes   */}
            </Routes>
        </Router>
    );
}

export default App;
