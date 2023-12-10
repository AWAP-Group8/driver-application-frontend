import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './PickUpParcels.css';

const PickUpParcels = () => {
    const navigate = useNavigate();
    const [waitingParcels, setWaitingParcels] = React.useState([]);
    const [selectedLocker, setSelectedLocker] = React.useState(false);

    const handleSelectLocker = () => {
        setSelectedLocker(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    //function to fetch parcels from the database and filter out the parcels that are waiting for dropping off
    const fetchParcels = async (locker) => {
        try {
            const response = await axios.get(`/driver/canDeliverCabinets`, {
                params: { locker: locker },
                headers: {
                    token: localStorage.getItem('token'),
                },
            });

            const parcels = response.data.data.result;
            const waitingParcels = parcels.filter((parcel) => parcel.parcel_status === 'waiting for dropping off' && parcel.sender_locker === locker);
            setWaitingParcels(waitingParcels);
            console.log(waitingParcels);
        } catch (error) {
            console.error('Error during locker selection:', error);
        }
    };

    //function to handle the click of the button to pick up the parcel
const handlePickUp = async (selectedLocker, selectedCabinet, code) => {
    try {
       
        console.log(selectedLocker, selectedCabinet, code);
        const response = await axios.post(`/driver/pickupParcel`, {
            selectedLocker: selectedLocker,
            selectedCabinet: selectedCabinet,
            code: code,
        }, {
            headers: {
                token: localStorage.getItem('token'),
            },
        });
        
        const result = response.data;

        if (result.success) {
            alert(result.msg);

           
            const updatedParcels = waitingParcels.filter(p => p.sender_cabinet !== selectedCabinet);

            setWaitingParcels(updatedParcels);

        } else {
            alert(result.msg);
        }

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
                            {waitingParcels.length > 0 ? (
                                <div className='parcel-list'>
                                    <p>Parcels in the locker:</p>
                                    {waitingParcels.map((parcel) => (
                                        <div key={parcel.sender_cabinet} className="parcel-card">
                                            <p>locker: {parcel.sender_locker}</p>
                                            <p>cabinet: {parcel.sender_cabinet}</p>
                                            <p>code: {parcel.sender_code}</p>
                                            <button onClick={() => handlePickUp(parcel.sender_locker, parcel.sender_cabinet, parcel.sender_code)}>
                                                pick up
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No parcels for you to pick up at the current locker location</p>
                            )}
                        </>
                    )}


                </div>
            </div>

        </div>
    )
}

export default PickUpParcels;