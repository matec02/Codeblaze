import React from 'react';
import Home from './components/Home';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import ProfilePending from './components/ProfilePending';
import ProfileBlocked from './components/ProfileBlocked';
import MyScooter from './components/MyScooter';
import RegisterScooterForm from './components/RegisterScooterForm';
import './App.css';
import NavBar from "./components/NavBar";
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

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
                <Route path="/profile-pending" element={<ProfilePending/>}/>
                <Route path="/profile-blocked" element={<ProfileBlocked/>}/>
                <Route path="/scooters" element={<MyScooter/>}/>
                <Route path="/add-scooter" element={<RegisterScooterForm/>}/>
                {/* Test for just 1 ScooterCard - uncomment import and route to test
                <Route path="/scooter" element={<ScooterCard/>}/>
                */}


                {/* TODO add all possible routes   */}
            </Routes>
        </Router>
    );
}

export default App;
