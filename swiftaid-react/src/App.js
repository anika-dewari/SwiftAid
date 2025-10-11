import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EmergencyPortal from './pages/EmergencyPortal';
import AmbulanceManagement from './pages/AmbulanceManagement';
import HospitalManagement from './pages/HospitalManagement';
import DriverManagement from './pages/DriverManagement';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/emergency" element={<EmergencyPortal />} />
          <Route path="/ambulances" element={<AmbulanceManagement />} />
          <Route path="/hospitals" element={<HospitalManagement />} />
          <Route path="/drivers" element={<DriverManagement />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;