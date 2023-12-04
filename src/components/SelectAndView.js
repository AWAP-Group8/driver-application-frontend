// SelectAndView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './SelectAndView.css';

const SelectAndView = () => {
    const [selectedLocker, setSelectedLocker] = useState(null);
    const [cabinetStatuses, setCabinetStatuses] = useState([]);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Initialize with an appropriate value
    const navigate = useNavigate();// Initialize the useNavigate hook

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    // Function to navigate to 'Pick Up Parcels' page with the selected locker
    const handleNavigateToPickUpParcels = () => {
        // Ensure a locker is selected before navigating
        if (selectedLocker) {
            // Use the navigate function to navigate to the 'pick-up-parcels' page with the selected locker as a parameter
            navigate(`/pick-up-parcels/${selectedLocker.locker}`);
        } else {
            // Handle case where no locker is selected
            console.warn('Please select a locker before proceeding.');
        }
    };


    // Function to handle locker selection
    const handleSelectLocker = async (locker) => {
        try {
            const response = await axios.get('/availableCabinets', {
                params: { locker: locker }
            });

            if (response.data.success) {
                setSelectedLocker({
                    locker: locker,
                    cabinet_status: 'free',
                });
                setCabinetStatuses(response.data.data.cabinets);
                setError('');
            } else {
                setSelectedLocker(null);
                setError(response.data.msg);
            }
        } catch (error) {
            console.error('Error during locker selection:', error);
            setError('Internal server error');
        }
    };

    // Function to fetch cabinet statuses
    const fetchCabinetStatuses = async (locker) => {
        try {
            const response = await axios.get(`/cabinet-statuses/${locker}`);
            setCabinetStatuses(response.data.statuses);
        } catch (error) {
            console.error('Error fetching cabinet statuses:', error);
            setError('Error fetching cabinet statuses. Please try again.');
        }
    };

    // UseEffect to fetch cabinet statuses when selectedLocker changes
    useEffect(() => {
        if (selectedLocker) {
            fetchCabinetStatuses(selectedLocker.locker);
        }
    }, [selectedLocker]);

    return (
        <div className='container'>
            <div className="nav">
                <nav className="navbar">
                    <div className='links'>
                        <div className='link'><Link to="/select-and-view">Select and View</Link></div>
                        <div className='link'> <Link to="/pick-up-parcels">Pick Up Parcels</Link></div>
                        <div className='link'><Link to="/deliver-parcels">Deliver Parcels</Link></div>
                    </div>

                    <span className='logo'></span>
                    <span className='logout' onClick={handleLogout}>log out</span>
                </nav>
            </div>

            <div className='content'>
                {/* Display locker selection options */}
                <div className='lockers'>
                    <p>Please select a locker:</p>
                    <button onClick={() => handleSelectLocker('A')}>Locker A</button>
                    <button onClick={() => handleSelectLocker('B')}>Locker B</button>
                    <button onClick={() => handleSelectLocker('C')}>Locker C</button>
                    <button onClick={() => handleSelectLocker('D')}>Locker D</button>
                    <button onClick={() => handleSelectLocker('E')}>Locker E</button>
                </div>

                {/* Display selected locker information */}
                {selectedLocker && (
                    <div>
                        <p>Selected Locker: {selectedLocker.locker}</p>
                        <p>Cabinet Status: {selectedLocker.cabinet_status}</p>
                    </div>
                )}

                {/* Display available cabinets */}
                {cabinetStatuses.length > 0 && (
                    <div>
                        <p>Available Cabinets:</p>
                        <div className="cabinet-cards">
                            {cabinetStatuses.map((status, index) => (
                                status === 'free' && (
                                    <div key={index} className="cabinet-card">
                                        <p>{`Locker ${selectedLocker.locker} Cabinet ${index + 1}`}</p>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                )}

                {/* Display error message */}
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
};

export default SelectAndView;


