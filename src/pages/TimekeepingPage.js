import React, { useState, useEffect } from 'react';

const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

function TimekeepingPage() {
  // --- Form State ---
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [entryDate, setEntryDate] = useState(getTodayString());
  const [hours, setHours] = useState('');
  const [project, setProject] = useState('');

  // --- New: State for the time entry list ---
  const [timeEntries, setTimeEntries] = useState([]);

  // --- New: Function to fetch time entries ---
  const fetchTimeEntries = async () => {
    const result = await window.electronAPI.getTimeEntries();
    if (result.success) {
      setTimeEntries(result.timeEntries);
    } else {
      alert(result.message);
    }
  };

  // --- useEffect to load all data on component mount ---
  useEffect(() => {
    const fetchInitialData = async () => {
      const empResult = await window.electronAPI.getEmployees();
      if (empResult.success) {
        setEmployees(empResult.employees);
        if (empResult.employees.length > 0) {
          setSelectedEmployee(empResult.employees[0].id);
        }
      }
      // Also fetch time entries
      fetchTimeEntries();
    };
    fetchInitialData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedEmployee || !hours) {
      alert('Please select an employee and enter hours.');
      return;
    }
    const timeEntryData = {
      employee_id: parseInt(selectedEmployee, 10),
      entry_date: entryDate,
      hours: parseFloat(hours),
      project,
    };
    const result = await window.electronAPI.logTime(timeEntryData);

    if (result.success) {
      alert(result.message);
      setHours('');
      setProject('');
      // --- New: Refresh the list after logging time ---
      fetchTimeEntries();
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="page">
      <h1>Timekeeping</h1>

      <div className="form-container">
        {/* The form JSX is unchanged */}
        <h2>Log New Time Entry</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-row">
                <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
                    <option value="" disabled>-- Select an Employee --</option>
                    {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                    ))}
                </select>
            </div>
            <div className="form-row">
                <input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
                <input type="number" step="0.25" min="0" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Hours Worked" />
            </div>
            <div className="form-row">
                <input type="text" value={project} onChange={(e) => setProject(e.target.value)} placeholder="Project or Task Description (Optional)" />
            </div>
            <button type="submit">Log Time</button>
        </form>
      </div>

      {/* --- New: Time Entries List Table --- */}
      <div className="list-container">
        <h2>Recent Time Entries</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee Name</th>
              <th>Hours</th>
              <th>Project</th>
            </tr>
          </thead>
          <tbody>
            {timeEntries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.entry_date}</td>
                <td>{entry.firstName} {entry.lastName}</td>
                <td>{entry.hours.toFixed(2)}</td>
                <td>{entry.project}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TimekeepingPage;