import React, { useState, useEffect } from 'react';

function EmployeesPage() {
  const [editingId, setEditingId] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [payRate, setPayRate] = useState('');
  const [payType, setPayType] = useState('Hourly');
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    const result = await window.electronAPI.getEmployees();
    if (result.success) setEmployees(result.employees);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const clearForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPayRate('');
    setPayType('Hourly');
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const employeeData = { firstName, lastName, email, payRate: parseFloat(payRate) || 0, payType };
    const result = editingId
      ? await window.electronAPI.updateEmployee(editingId, employeeData)
      : await window.electronAPI.addEmployee(employeeData);

    if (result.success) {
      alert(result.message);
      clearForm();
      fetchEmployees();
    } else {
      alert(result.message);
    }
  };

  const handleEditClick = (employee) => {
    setEditingId(employee.id);
    setFirstName(employee.firstName);
    setLastName(employee.lastName);
    setEmail(employee.email);
    setPayRate(employee.payRate);
    setPayType(employee.payType);
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    const result = await window.electronAPI.deleteEmployee(employeeId);
    if (result.success) {
      alert(result.message);
      fetchEmployees();
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="page">
      <h1>Employee Management</h1>
      <div className="form-container">
        <h2>{editingId ? 'Edit Employee' : 'Add New Employee'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row"><input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name"/><input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name"/></div>
          <div className="form-row"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address"/></div>
          <div className="form-row"><input type="number" value={payRate} onChange={(e) => setPayRate(e.target.value)} placeholder="Pay Rate (€/hr or Salary)"/><select value={payType} onChange={(e) => setPayType(e.target.value)}><option value="Hourly">Hourly</option><option value="Salary">Salary</option></select></div>
          <button type="submit">{editingId ? 'Update Employee' : 'Add Employee'}</button>
          {editingId && (<button type="button" className="cancel-button" onClick={clearForm}>Cancel Edit</button>)}
        </form>
      </div>
      <div className="list-container">
        <h2>Employee List</h2>
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Pay Rate</th><th>Pay Type</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.firstName} {emp.lastName}</td>
                <td>{emp.email}</td>
                <td>{emp.payRate}</td>
                <td>{emp.payType}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEditClick(emp)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(emp.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeesPage;