import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './PickUpParcels.css';

const DeliverParcels = () => {
    const navigate = useNavigate();
        const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        };

   
        const fetchParcels = async (locker) => {
            try {
                const response = await axios.get(`/driver/canDeliverCabinets`,{
                    params: { locker: locker },
                    headers: {
                        token: localStorage.getItem('token'),
                    },
                });
    
                const parcels = response.data.data.result;
                const dropingParcels = parcels.filter((parcel) => parcel.parcel_status === 'during transportation' && parcel.pickup_locker === locker);
                console.log(dropingParcels);
            } catch (error) {
                console.error('Error during locker selection:', error);
            }
        };

    
    
    // Filter parcels with status 'waiting for sending'
    //const waitingParcels = parcels.filter((parcel) => parcel.parcel_status === 'waiting for sending');

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
                    <button onClick={() => fetchParcels('A')}>Locker A</button>
                    <button onClick={() => fetchParcels('B')}>Locker B</button>
                    <button onClick={() => fetchParcels('C')}>Locker C</button>
                    <button onClick={() => fetchParcels('D')}>Locker D</button>
                    <button onClick={() => fetchParcels('E')}>Locker E</button>
                </div>
                </div>

        </div>
    )
}

export default DeliverParcels;