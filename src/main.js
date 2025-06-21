// src/main.js
const { app, BrowserWindow } = require('electron');
require('./database/database.js');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools only in development
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Add to the bottom of src/main.js

const { ipcMain } = require('electron');
const db = require('./database/database.js');

ipcMain.handle('add-employee', (event, employeeData) => {
  try {
    const { firstName, lastName, email, payRate, payType } = employeeData;
    const stmt = db.prepare(
      'INSERT INTO employees (firstName, lastName, email, payRate, payType) VALUES (?, ?, ?, ?, ?)'
    );
    const info = stmt.run(firstName, lastName, email, payRate, payType);
    console.log(`Employee added with ID: ${info.lastInsertRowid}`);
    return { success: true, message: 'Employee added successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Failed to add employee.' };
  }
});


ipcMain.handle('get-employees', () => {
  try {
    const stmt = db.prepare('SELECT * FROM employees ORDER BY lastName ASC');
    const employees = stmt.all();
    return { success: true, employees };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Failed to retrieve employees.' };
  }
});

// Add to the bottom of src/main.js

ipcMain.handle('add-client', (event, clientData) => {
  try {
    const { name, contact_person, contact_email } = clientData;
    const stmt = db.prepare(
      'INSERT INTO clients (name, contact_person, contact_email) VALUES (?, ?, ?)'
    );
    const info = stmt.run(name, contact_person, contact_email);
    console.log(`Client added with ID: ${info.lastInsertRowid}`);
    return { success: true, message: 'Client added successfully.' };
  } catch (error) {
    console.error('Database error adding client:', error);
    return { success: false, message: 'Failed to add client. The client name may already exist.' };
  }
});

ipcMain.handle('get-clients', () => {
  try {
    const stmt = db.prepare('SELECT * FROM clients ORDER BY name ASC');
    const clients = stmt.all();
    return { success: true, clients };
  } catch (error) {
    console.error('Database error getting clients:', error);
    return { success: false, message: 'Failed to retrieve clients.' };
  }
});

// Add to the bottom of src/main.js

ipcMain.handle('log-time', (event, timeEntryData) => {
  try {
    const { employee_id, entry_date, hours, project } = timeEntryData;
    const stmt = db.prepare(
      'INSERT INTO time_entries (employee_id, entry_date, hours, project) VALUES (?, ?, ?, ?)'
    );
    const info = stmt.run(employee_id, entry_date, hours, project);
    console.log(`Time entry added with ID: ${info.lastInsertRowid}`);
    return { success: true, message: 'Time entry logged successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Failed to log time entry.' };
  }
});

// Add to the bottom of src/main.js

// Add this to the bottom of src/main.js

ipcMain.handle('get-time-entries', () => {
  try {
    const query = `
      SELECT
        te.id,
        te.entry_date,
        te.hours,
        te.project,
        emp.firstName,
        emp.lastName
      FROM time_entries te
      JOIN employees emp ON te.employee_id = emp.id
      ORDER BY te.entry_date DESC
    `;
    const stmt = db.prepare(query);
    const timeEntries = stmt.all();
    return { success: true, timeEntries };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Failed to retrieve time entries.' };
  }

  ipcMain.handle('add-client', (event, clientData) => {
    try {
      const { name, contact_person, email, phone } = clientData;
      const stmt = db.prepare(
        'INSERT INTO clients (name, contact_person, email, phone) VALUES (?, ?, ?, ?)'
      );
      const info = stmt.run(name, contact_person, email, phone);
      console.log(`Client added with ID: ${info.lastInsertRowid}`);
      return { success: true, message: 'Client added successfully.' };
    } catch (error) {
      console.error('Database error:', error);
      // Handle unique constraint error specifically
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return { success: false, message: `Failed to add client. A client with the name "${clientData.name}" already exists.` };
      }
      return { success: false, message: 'Failed to add client.' };
    }
  });


  ipcMain.handle('get-clients', () => {
    try {
      const stmt = db.prepare('SELECT * FROM clients ORDER BY name ASC');
      const clients = stmt.all();
      return { success: true, clients };
    } catch (error) {
      console.error('Database error:', error);
      return { success: false, message: 'Failed to retrieve clients.' };
    }
  });

// Add to the bottom of src/main.js

  ipcMain.handle('delete-employee', (event, employeeId) => {
  try {
  const stmt = db.prepare('DELETE FROM employees WHERE id = ?');
  const info = stmt.run(employeeId);

  if (info.changes > 0) {
    console.log(`Deleted employee with ID: ${employeeId}`);
    return { success: true, message: 'Employee deleted successfully.' };
  } else {
    return { success: false, message: 'Employee not found.' };
  }
  } catch (error) {
  console.error('Database error:', error);
  return { success: false, message: 'Failed to delete employee.' };
  }
  });


});