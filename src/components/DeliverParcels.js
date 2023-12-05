import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './DeliverParcels.css';

const DeliverParcels = () => {
    const [freeCabinets, setFreeCabinets] = useState([]);
    const [selectedCabinet, setSelectedCabinet] = useState(null);
    const [undeliveredParcels, setUndeliveredParcels] = useState([]);
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Initialize with an appropriate value

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    useEffect(() => {
        // Fetch the list of free cabinets and undelivered parcels when the component mounts
        const fetchData = async () => {
            try {
                const cabinetsResponse = await axios.get('/free-cabinets');
                const parcelsResponse = await axios.get('/undelivered-parcels');

                if (cabinetsResponse.data.success) {
                    setFreeCabinets(cabinetsResponse.data.data);
                } else {
                    console.error('Error fetching free cabinets:', cabinetsResponse.data.msg);
                }

                if (parcelsResponse.data.success) {
                    setUndeliveredParcels(parcelsResponse.data.data);
                } else {
                    console.error('Error fetching undelivered parcels:', parcelsResponse.data.msg);
                }
            } catch (error) {
                console.error('Error during fetch:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to ensure the effect runs only once

    const handleSelectCabinet = (cabinet) => {
        setSelectedCabinet(cabinet);
    };

    const handleSelectParcel = (parcel) => {
        setSelectedParcel(parcel);
    };

    const handleDeliverParcel = () => {
        if (selectedCabinet && selectedParcel) {
            const message = `Deliver a parcel to Cabinet ${selectedCabinet.cabinetNumber} with Pickup Code ${selectedParcel.pickupCode}`;
            alert(message);
            // Optionally, you can send a request to mark the parcel as delivered
            // and update the UI accordingly.
        } else {
            console.warn('Please select a cabinet and a parcel before delivering.');
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
                    <button className='logout' onClick={handleLogout}>log out</button>
                </nav>
            </div>

            <div className='content'>
                <p>Select a free cabinet and choose a parcel to deliver</p>
                <div className="free-cabinets">
                    {freeCabinets.map((cabinet) => (
                        <div
                            key={cabinet.id}
                            className={`cabinet-card ${selectedCabinet && selectedCabinet.id === cabinet.id ? 'selected' : ''}`}
                            onClick={() => handleSelectCabinet(cabinet)}
                        >
                            <p>Cabinet Location: {cabinet.location}</p>
                            <p>Cabinet Number: {cabinet.cabinetNumber}</p>
                        </div>
                    ))}
                </div>
                <p>View parcels during transportation and choose one to deliver</p>
                <div className="undelivered-parcels">
                    {undeliveredParcels.map((parcel) => (
                        <div
                            key={parcel.id}
                            className={`parcel-card ${selectedParcel && selectedParcel.id === parcel.id ? 'selected' : ''}`}
                            onClick={() => handleSelectParcel(parcel)}
                        >
                            <p>Tracking Number: {parcel.trackingNumber}</p>
                        </div>
                    ))}
                </div>
                <button onClick={handleDeliverParcel}>Deliver a Parcel</button>
            </div>
        </div>
    );
};

export default DeliverParcels;

