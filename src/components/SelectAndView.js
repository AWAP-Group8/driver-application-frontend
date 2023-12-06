// SelectAndView.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './SelectAndView.css';

const SelectAndView = () => {
    const [error, setError] = useState('');
    const [cabinet, setCabinet] = useState([]); // State to store cabinet numbers
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleSelectLocker = async (locker) => {
        try {
            const response = await axios.get('/driver/availableCabinets', {
                params: { locker: locker },
                headers: {
                    token: localStorage.getItem('token'),
                },
            });

            const cabinetNumbers = response.data.data.cabinets;
            setCabinet(cabinetNumbers);
        } catch (error) {
            console.error('Error during locker selection:', error);
            setError('Internal server error');
        }
    };




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
                    {localStorage.getItem('token') && (
                        <button className='logout' onClick={handleLogout}>log out</button>
                    )}
                </nav>
            </div>

            <div className='content'>
                <div className='lockers'>
                    <p>Please select a locker:</p>
                    <button onClick={() => handleSelectLocker('A')}>Locker A</button>
                    <button onClick={() => handleSelectLocker('B')}>Locker B</button>
                    <button onClick={() => handleSelectLocker('C')}>Locker C</button>
                    <button onClick={() => handleSelectLocker('D')}>Locker D</button>
                    <button onClick={() => handleSelectLocker('E')}>Locker E</button>
                </div>

                {/* Display cabinet numbers based on the selected locker */}
                {cabinet.length > 0 && (
                    <div className='cabinets'>
                        <p>Free cabinets at the selected locker:</p>
                        {cabinet.map((cabinetNumber) => (
                            <div key={cabinetNumber}>{cabinetNumber}</div>
                        ))}
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
};

export default SelectAndView;

