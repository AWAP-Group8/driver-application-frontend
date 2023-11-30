// SelectAndView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SelectAndView = () => {
    const [selectedLocker, setSelectedLocker] = useState(null);
    const [availableCabinets, setAvailableCabinets] = useState([]);
    const [error, setError] = useState('');

    // Function to handle locker selection
    const handleSelectLocker = async (locker) => {
        try {
            const response = await axios.get('/select-active-parcel-locker', {
                params: { locker: locker }
            });

            if (response.data.success) {
                setSelectedLocker(response.data.data);
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

    // Function to get available cabinets
    const fetchAvailableCabinets = async (locker) => {
        try {
            const response = await axios.get(`/available-cabinets/${locker}`);
            setAvailableCabinets(response.data.cabinets);
        } catch (error) {
            console.error('Error fetching available cabinets:', error);
        }
    };

    // UseEffect to fetch available cabinets when selectedLocker changes
    useEffect(() => {
        if (selectedLocker) {
            fetchAvailableCabinets(selectedLocker.locker);
        }
    }, [selectedLocker]);

    return (
        <div>
            <h2>Select and View</h2>

            {/* Display locker selection options */}
            <div>
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
            {availableCabinets.length > 0 && (
                <div>
                    <p>Available Cabinets:</p>
                    <ul>
                        {availableCabinets.map((cabinet) => (
                            <li key={cabinet}>{cabinet}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Display error message */}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default SelectAndView;

