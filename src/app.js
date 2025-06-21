// src/app.js
import './index.css';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import EmployeesPage from './pages/EmployeesPage.js';
import TimekeepingPage from './pages/TimekeepingPage.js';
import ClientsPage from './pages/ClientsPage.js'; // Ensure this import is here

function App() {
  const [currentPage, setCurrentPage] = useState('clients');

  return (
    <div>
      <nav className="main-nav">
        <button onClick={() => setCurrentPage('employees')}>Employees</button>
        <button onClick={() => setCurrentPage('timekeeping')}>Timekeeping</button>
        <button onClick={() => setCurrentPage('clients')}>Clients</button> {/* Ensure onClick is correct */}
      </nav>

      <main>
        {currentPage === 'employees' && <EmployeesPage />}
        {currentPage === 'timekeeping' && <TimekeepingPage />}
        {currentPage === 'clients' && <ClientsPage />} {/* Ensure this line is here */}
      </main>
    </div>
  );
}

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(<App />);