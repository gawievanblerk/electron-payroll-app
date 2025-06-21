// src/pages/ClientsPage.js
import React, { useState, useEffect } from 'react';

function ClientsPage() {
  // State for the form inputs
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // State for the list of clients
  const [clients, setClients] = useState([]);

  // Function to fetch clients from the database
  const fetchClients = async () => {
    const result = await window.electronAPI.getClients();
    if (result.success) {
      setClients(result.clients);
    } else {
      alert(result.message);
    }
  };

  // useEffect to load clients when the page first opens
  useEffect(() => {
    fetchClients();
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name) {
      alert('Client Name is required.');
      return;
    }
    const clientData = { name, contact_person: contactPerson, email, phone };
    const result = await window.electronAPI.addClient(clientData);

    if (result.success) {
      alert(result.message);
      // Clear the form and refresh the list
      setName('');
      setContactPerson('');
      setEmail('');
      setPhone('');
      fetchClients();
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="page">
      <h1>Client Management</h1>

      <div className="form-container">
        <h2>Add New Client</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Client Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Contact Person"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />
            <input
              type="email"
              placeholder="Contact Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button type="submit">Add Client</button>
        </form>
      </div>

      <div className="list-container">
        <h2>Client List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client Name</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.name}</td>
                <td>{client.contact_person}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientsPage;