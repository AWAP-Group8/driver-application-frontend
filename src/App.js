import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import SelectAndView from './components/SelectAndView';
import PickUpParcels from './components/PickUpParcels';
import DeliverParcels from './components/DeliverParcels';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/select-and-view" element={<SelectAndView />} />
          <Route path="/pick-up-parcels" element={<PickUpParcels />} />
          <Route path="/deliver-parcels" element={<DeliverParcels />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
