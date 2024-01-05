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
import MyProfile from "./components/MyProfile";

import AdminRoute from "./components/AdminRoute";
import ProtectedRoutes from "./components/ProtectedRoutes"
import ProtectedRouteScooter from "./components/ProtectedRouteScooter"
import Unauthorized from "./components/Unauthorized";
import ChatPanel from "./components/ChatPanel";
import ChatWindow from "./components/ChatWindow";
import ChatMessage from "./components/ChatMessage";

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

                <Route path="/chat-panel" element={
                    <ProtectedRoutes>
                        <ChatPanel/>
                    </ProtectedRoutes>
                    }/>


                <Route path="/chat-window" element={
                    <ProtectedRoutes>
                        <ChatWindow/>
                    </ProtectedRoutes>
                }/>


                <Route path="/chat-message" element={
                    <ProtectedRoutes>
                        <ChatMessage/>
                    </ProtectedRoutes>
                }/>

                <Route path="/profile-pending" element={
                        <ProfilePending />
                }/>
                <Route path="/profile-blocked" element={
                        <ProfileBlocked />
                }/>
                <Route path="/scooters" element={
                    <ProtectedRoutes>
                        {/*pending se moze login, ali ne moze dodati scooter*/}
                        <ProtectedRouteScooter>
                            <MyScooter />
                        </ProtectedRouteScooter>
                    </ProtectedRoutes>
                }/>
                <Route path="/add-scooter" element={
                    <ProtectedRoutes>
                        <RegisterScooterForm />
                    </ProtectedRoutes>
                }/>
                <Route path="/profile" element={
                    <ProtectedRoutes>
                        <MyProfile/>
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
                <Route path="/imageChangeRequests" element={
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
