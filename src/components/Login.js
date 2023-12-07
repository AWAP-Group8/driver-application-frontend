import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

axios.defaults.baseURL = `https://gogoship.azurewebsites.net`;

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
            const response = await axios.get('/driver/login', {
                params: {
                    driver_email: email,
                    password: password,
                },
            });
            console.log('After axios request', response);

            // Check the response from the backend
            if (response.data.success) {
                setIsLoggedIn(true);
                navigate('/select-and-view');  // Navigate to the desired route
                console.log('Login successful');
                console.log('Token:', response.data.data.token);
                console.log('User info:', response.data.data.info);
                const token = response.data.data.token;
                localStorage.setItem('token', token)
            } else {
                // If login fails, set the error message
                setError(response.data.msg);
            }
        } catch (error) {
            if (error.response && error.response.status !== 200) {
                setError('Invalid credentials');  // Handle non-200 status code
            } else {
                console.error('Error during login:', error);
                setError('Internal server error');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="nav">
                <nav className="navbar">
                    {isLoggedIn ? (
                        // If logged in, show navigation links
                        <div className='links'>
                            <div className='link'><Link to="/select-and-view">Select and View</Link></div>
                            <div className='link'> <Link to="/pick-up-parcels">Pick Up Parcels</Link></div>
                            <div className='link'><Link to="/deliver-parcels">Deliver Parcels</Link></div>
                        </div>
                    ) : (
                        // If not logged in, show nothing
                        <></>
                    )}

                    <span className='logo'></span>

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
