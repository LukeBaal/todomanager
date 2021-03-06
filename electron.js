const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

// SET ENV
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', () => {
  //Create new window
  mainWindow = new BrowserWindow({});
  // Load html into window
  // mainWindow.loadURL('http://localhost:8080');
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  }));
  // Quit app when closed
  mainWindow.on('closed', () => app.quit());

  // Build menu from template
  if (process.platform == 'darwin') {
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(mainMenu);    
  }
  else {
    // Hide menu
    Menu.setApplicationMenu(null);    
  }
});

// Create menu template
const mainMenuTemplate = [
  {
    label:'File',
    submenu: [
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
];

// If mac, add empty object to menu
if (process.platform === 'darwin') {
  mainMenuTemplate.unshift({});
}

// Add developer tools item if not in production
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}
