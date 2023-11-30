import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

axios.defaults.baseURL = 'http://localhost:8080';

const Login = () => {
    // State variables to hold email, password, and error message
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Function to handle login button click
    const handleLogin = async () => {
        try {
            setIsLoading(true);
            // Make a request to the backend to authenticate the user
            console.log('Before axios request');
            const response = await axios.post('/login', {
                driver_email: email,
                password: password
            });
            console.log('After axios request', response);

            // Check the response from the backend
            if (response.data.success) {
                // If login is successful, set the login status to true
                setIsLoggedIn(true);
                navigate('/select-and-view');
                // Handle other login success actions here
                console.log('Login successful');
                console.log('Token:', response.data.data.token);
                console.log('User info:', response.data.data.info);
            } else {
                // If login fails, set the error message
                setError(response.data.msg);
            }
        } catch (error) {
            // Handle any unexpected errors
            console.error('Error during login:', error);
            setError('Internal server error');
        }
    };

    // Function to handle logout button click
    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <div className="login-container">
            <div className="nav">
                <nav className="navbar">
                    {isLoggedIn ? (
                        // If logged in, show navigation links
                        <>
                            <span>
                                <Link to="/select-and-view">Select and View</Link>
                            </span>
                            <span>
                                <Link to="/pick-up-parcels">Pick Up Parcels</Link>
                            </span>
                            <span>
                                <Link to="/deliver-parcels">Deliver Parcels</Link>
                            </span>
                        </>
                    ) : (
                        // If not logged in, show nothing
                        <></>
                    )}
                    <span></span>
                    <span onClick={handleLogout}>log out</span>
                </nav>
            </div>

            <div className="below-nav">
                <div className="image">
                </div>

                <div className="login-form">
                    <h3>
                        <span>GoGoShip</span>
                        <span>Driver Services</span>
                    </h3>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin} disabled={isLoading}>log in</button>
                    {error && <div className="error-message">{error}</div>}
                </div>
            </div>
        </div>

    );
};

export default Login;
