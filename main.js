const {app, BrowserWindow, dialog, Menu, MenuItem, ipcMain} = require("electron");
const fs = require("fs");

var browserWindow;

function openFile(browserWindow) {
  dialog.showOpenDialog((fileNames) => {
    // fileNames is an array that contains all the selected
    if(fileNames === undefined || fileNames.length == 0){
      console.log("No file selected");
      return;
    }

    var filePath = fileNames[0];
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if(err){
        alert("An error ocurred reading the file :" + err.message);
        return;
      }

      browserWindow.webContents.send(
        'show-file',
        {
          filePath: filePath,
          content: data,
        }
      )
    });
  });
}

function createWindow() {
  browserWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  browserWindow.loadFile("editor.html");

  // browserWindow.webContents.openDevTools();

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          click: () => {openFile(browserWindow);}
        },
        {
          label: 'Save',
          click: () => {
            browserWindow.webContents.send('save-file');
          },
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo'
        },
        {
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'paste'
        }
      ]
    },

    {
      label: 'View',
      submenu: [
        {
          role: 'reload'
        },
        {
          role: 'toggledevtools'
        },
        {
          type: 'separator'
        },
        {
          role: 'resetzoom'
        },
        {
          role: 'zoomin'
        },
        {
          role: 'zoomout'
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        }
      ]
    },

    {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    },

    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More'
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  browserWindow.on("closed", function() {
    browserWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function() {
  app.quit();
});


app.on("activate", function() {
  if (browserWindow === null) {
    createWindow();
  }
});

