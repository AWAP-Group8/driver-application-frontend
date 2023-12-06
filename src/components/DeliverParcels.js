import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './DeliverParcels.css';

const DeliverParcels = () => {
    const navigate = useNavigate();
    const [dropingParcels, setDropingParcels] = React.useState([]);
    const [selectedLocker, setSelectedLocker] = React.useState(false);

    const handleSelectLocker = () => {
        setSelectedLocker(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const fetchParcels = async (locker) => {
        try {
            const response = await axios.get(`/driver/canDeliverCabinets`, {
                params: { locker: locker },
                headers: {
                    token: localStorage.getItem('token'),
                },
            });

            const parcels = response.data.data.result;
            const dropingParcels = parcels.filter((parcel) => parcel.parcel_status === 'during transportation' && parcel.pickup_locker === locker);
            setDropingParcels(dropingParcels);

        } catch (error) {
            console.error('Error during locker selection:', error);
        }
    };

    //function to handle the click of the button to deliver the parcel
    const handleDelivery = async (selectedLocker, selectedCabinet) => {
        try {
            // Make a request to the backend 
            console.log(selectedLocker, selectedCabinet);
            const response = await axios.post(`/driver/deliverParcels`, {
                selectedLocker: selectedLocker,
                selectedCabinet: selectedCabinet,
            }, {
                headers: {
                    token: localStorage.getItem('token'),
                },

            });
            const result = response.data;
            if (result.success) {
                alert(result.msg);
                window.location.reload();
            } else {
                alert(result.msg);
            }

            // Check the response from the backend

        } catch (error) {

            alert('Error during picking up:', error);

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
                    <button onClick={() => { fetchParcels('A'); handleSelectLocker(); }}>Locker A</button>
                    <button onClick={() => { fetchParcels('B'); handleSelectLocker(); }}>Locker B</button>
                    <button onClick={() => { fetchParcels('C'); handleSelectLocker(); }}>Locker C</button>
                    <button onClick={() => { fetchParcels('D'); handleSelectLocker(); }}>Locker D</button>
                    <button onClick={() => { fetchParcels('E'); handleSelectLocker(); }}>Locker E</button>
                </div>


                <div className='parcels'>
                    {selectedLocker && (
                        <>
                            {dropingParcels.length > 0 ? (
                                <div className='parcel-list'>
                                    <p>Parcels in the locker:</p>
                                    {dropingParcels.map((parcel) => (
                                        <div key={parcel.pickup_cabinet} className="parcel-card">
                                            <p>locker: {parcel.pickup_locker}</p>
                                            <p>cabinet: {parcel.pickup_cabinet}</p>
                                            <button onClick={() => handleDelivery(parcel.pickup_locker, parcel.pickup_cabinet)}>
                                                deliver
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (

                                <p>No parcels for you to deliver at current locker location</p>

                            )}
                        </>
                    )}
                </div>
            </div>


        </div>
    );
}

export default DeliverParcels;