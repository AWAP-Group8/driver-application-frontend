import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PickUpParcels = () => {
    const [parcels, setParcels] = useState([]);

    useEffect(() => {
        // Fetch the list of waiting parcels when the component mounts
        const fetchParcels = async () => {
            try {
                const response = await axios.get('/pickupParcels/:locker');
                if (response.data.success) {
                    setParcels(response.data.data);
                } else {
                    console.error('Error fetching parcels:', response.data.msg);
                }
            } catch (error) {
                console.error('Error during fetch:', error);
            }
        };

        fetchParcels();
    }, []); // Empty dependency array to ensure the effect runs only once

    const handleCardClick = (trackingNumber, senderCabinet) => {
        // Implement the logic to open the cabinet based on trackingNumber and senderCabinet
        console.log(`Opening cabinet for parcel ${trackingNumber} at cabinet ${senderCabinet}`);
    };

    return (
        <div>
            <h2>Waiting for Sending Parcels</h2>
            <div className="parcel-list">
                {parcels.map((parcel) => (
                    <div
                        key={parcel.tracking_number}
                        className="parcel-card"
                        onClick={() => handleCardClick(parcel.tracking_number, parcel.sender_cabinet)}
                    >
                        <p>Tracking Number: {parcel.tracking_number}</p>
                        <p>Sender Cabinet: {parcel.sender_cabinet}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PickUpParcels;
