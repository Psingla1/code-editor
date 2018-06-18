const {
  BrowserWindow,
  Menu,
  dialog,
} = require("electron");
const fs = require("fs");

function openFile(browserWindow) {
  dialog.showOpenDialog((fileNames) => {
    // fileNames is an array that contains all the selected
    if (fileNames === undefined || fileNames.length == 0) {
      console.log("No file selected");
      return;
    }

    var filePath = fileNames[0];
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        alert("An error ocurred reading the file :" + err.message);
        return;
      }

      browserWindow.webContents.send(
        'show-file', {
          filePath: filePath,
          content: data,
        }
      )
    });
  });
}

const template = [{
    label: 'File',
    submenu: [{
        label: 'Open',
        click: () => {
          var browserWindow = BrowserWindow.getFocusedWindow();
          if (!browserWindow) return;
          openFile(browserWindow);
        }
      },
      {
        label: 'Save',
        click: () => {
          const browserWindow = BrowserWindow.getFocusedWindow();
          if (!browserWindow) return;
          browserWindow.webContents.send('save-file');
        },
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [{
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
    submenu: [{
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
    submenu: [{
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },

  {
    role: 'help',
    submenu: [{
      label: 'Learn More'
    }]
  }
];

module.exports = {
  setupMenu: function() {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
}
