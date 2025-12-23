import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Telecalling from './pages/Telecalling';
import Inspection from './pages/Inspection';
import InspectionDetails from './pages/InspectionDetails';
import Administration from './pages/Administration';
import Users from './pages/Users';
import Auctions from './pages/Auctions';
import Sales from './pages/Sales';
import LoginPage from './pages/LoginPage';
import Authenticated from './components/Authenticated';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route element={<Authenticated />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="administration" element={<Administration />} />
            <Route path="users" element={<Users />} />
            <Route path="telecalling" element={<Telecalling />} />
            <Route path="inspection" element={<Inspection />} />
            <Route path="inspection/:id" element={<InspectionDetails />} />
            <Route path="sales" element={<Sales />} />
            <Route path="auctions" element={<Auctions />} />
            <Route path="retail" element={<div className="p-10 text-center text-gray-500">Retail View Placeholder</div>} />
            <Route path="operations" element={<div className="p-10 text-center text-gray-500">Operations View Placeholder</div>} />
            <Route path="accounts" element={<div className="p-10 text-center text-gray-500">Accounts View Placeholder</div>} />
            <Route path="reports" element={<div className="p-10 text-center text-gray-500">Reports View Placeholder</div>} />
            <Route path="bids" element={<div className="p-10 text-center text-gray-500">Bids View Placeholder</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
