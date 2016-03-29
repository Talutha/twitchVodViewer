var app = require('app');
var BrowserWindow = require('browser-window');
var mainWindow = null;

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 1100, 
        height: 600,
        resizable: true
    });
    
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});