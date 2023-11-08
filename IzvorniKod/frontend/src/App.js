import React from 'react';
import {BrowserRouter as Router, Route, Routes, Switch} from 'react-router-dom';
import Home from './components/Home';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={LoginForm} />
                <Route path="/register" component={RegisterForm} />
                {/* TODO add all possible routes   */}
            </Routes>
        </Router>
    );
}

export default App;
