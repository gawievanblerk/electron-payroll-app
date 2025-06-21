// src/database/database.js
const path = require('path');
const { app } = require('electron'); // Import the 'app' module
const Database = require('better-sqlite3');

// Get the standard, persistent path for user data
const userDataPath = app.getPath('userData');
// Construct the full path to our database file
const dbPath = path.join(userDataPath, 'payroll.db');

console.log('Database location:', dbPath); // Log the path so you know where it is

const db = new Database(dbPath, { verbose: console.log });

// Replace your existing initialize function with this one
function initialize() {
  console.log('Initializing database...');

  const createEmployeesTable = `
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT UNIQUE,
      payRate REAL NOT NULL,
      payType TEXT NOT NULL CHECK(payType IN ('Salary', 'Hourly'))
    );
  `;

  const createTimeEntriesTable = `
    CREATE TABLE IF NOT EXISTS time_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      entry_date TEXT NOT NULL,
      hours REAL NOT NULL,
      project TEXT,
      FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE
    );
  `;

  // --- Add the new clients table schema below ---
  const createClientsTable = `
    CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        contact_person TEXT,
        email TEXT,
        phone TEXT
    );
  `;

  // --- Execute all three statements ---
  db.exec(createEmployeesTable);
  db.exec(createTimeEntriesTable);
  db.exec(createClientsTable); // Add this line

  console.log('Database initialized successfully.');
}

initialize();

module.exports = db;