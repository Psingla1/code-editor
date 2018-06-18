const {
  BrowserWindow,
  app,
} = require("electron");
const electron = require("electron");

var browserWindow;

function createWindow() {
  const {
    width,
    height
  } = electron.screen.getPrimaryDisplay().workAreaSize;
  browserWindow = new BrowserWindow({
    width: width / 2,
    height: height / 2,
  });

  browserWindow.loadFile("editor.html");

  // browserWindow.webContents.openDevTools();

  browserWindow.on("closed", function() {
    browserWindow = null;
  });
}

app.on("ready", function() {
  createWindow();
  require('./menu').setupMenu();
});

app.on("window-all-closed", function() {
  app.quit();
});


app.on("activate", function() {
  if (browserWindow === null) {
    createWindow();
  }
});
