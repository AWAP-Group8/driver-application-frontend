import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import './PickUpParcels.css';

const PickUpParcels = () => {
    const [parcels, setParcels] = useState([]);
    const [locker, setLocker] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Initialize with an appropriate value
    const { locker: lockerParam } = useParams(); // Use the useParams hook to get the locker value from the URL

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    useEffect(() => {
        // Fetch the list of waiting parcels when the component mounts
        const fetchParcels = async () => {
            try {
                const response = await axios.get(`/canDeliverCabinets?locker=${lockerParam}`);
                if (response.data.success) {
                    setParcels(response.data.data.cabinets);
                } else {
                    console.error('Error fetching parcels:', response.data.msg);
                }
            } catch (error) {
                console.error('Error during fetch:', error);
            }
        };

        fetchParcels();
        setLocker(lockerParam); // Set the locker state with the value from the URL params
    }, [lockerParam]); //Use lockerParam as a dependency to re-fetch when the locker value changes

    const handleCardClick = async (senderCabinet) => {
        try {
            // Fetch the selected parcel details
            const response = await axios.post('/pickupParcel', {
                selectedLocker: lockerParam, // Replace with the actual locker value
                selectedCabinet: senderCabinet,
                code: senderCode // Replace with the actual code value
            });

            if (response.data.success) {
                // Implement logic to handle successful pickup
                console.log(`Parcel picked up successfully from cabinet ${senderCabinet}`);
            } else {
                console.error('Error picking up parcel:', response.data.msg);
            }
        } catch (error) {
            console.error('Error during pickup:', error);
        }
    };

    // Filter parcels with status 'waiting for sending'
    const waitingParcels = parcels.filter((parcel) => parcel.parcel_status === 'waiting for sending');

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
                    <button className='logout' onClick={handleLogout}>log out</button>
                </nav>
            </div>

            <div className='content'>
                <p>There are {waitingParcels.length} parcels for you to pick up. Please use the codes provided to open a cabinet.</p>
                <p>Click the card once you picked up a parcel.</p>
                <div className="parcel-list">
                    {waitingParcels.map((parcel) => (
                        <div
                            key={parcel.sender_cabinet}
                            className="parcel-card"
                            onClick={() => handleCardClick(parcel.sender_cabinet, parcel.sender_code)}
                        >
                            <p>Cabinet: {parcel.sender_cabinet}</p>
                            <p>Code: {parcel.sender_code}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default PickUpParcels;
