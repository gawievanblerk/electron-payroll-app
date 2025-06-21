// src/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  addEmployee: (employeeData) => ipcRenderer.invoke('add-employee', employeeData),
  getEmployees: () => ipcRenderer.invoke('get-employees'),
  logTime: (timeEntryData) => ipcRenderer.invoke('log-time', timeEntryData), 
  getTimeEntries: () => ipcRenderer.invoke('get-time-entries'),
  addClient: (clientData) => ipcRenderer.invoke('add-client', clientData),
  getClients: () => ipcRenderer.invoke('get-clients'),
  deleteEmployee: (employeeId) => ipcRenderer.invoke('delete-employee', employeeId),
});