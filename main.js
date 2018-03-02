const { app, BrowserWindow, globalShortcut } = require('electron');

let mainWindow;

app.on('ready', () => {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: false
		}
	});

	mainWindow.loadURL('https://music.amazon.in/');

	handleExternalNavigation(mainWindow.webContents);
	bindHelperShortcuts(mainWindow.webContents);

	mainWindow.on('close', function (e) {
		if (!mainWindow.forceClose)
			e.preventDefault();
		mainWindow.hide();
	});

	mainWindow.on('closed', function () {
		mainWindow = null;
	});
});

app.on('window-all-closed', () => {
	globalShortcut.unregisterAll();
	app.quit();
});

app.on('before-quit', () => {
	mainWindow.forceClose = true;
});

app.on('activate', () => {
	mainWindow.show();
});

/**
 * Opens a link using system's open command
 * 
 * @param {*} target 
 * @param {*} appName 
 * @param {*} callback 
 */
const open = (target, appName, callback) => {
	let opener;

	if (typeof (appName) === 'function') {
		callback = appName;
		appName = null;
	}

	opener = appName ? 'open -a "' + escape(appName) + '"' : 'open';
	if (process.env.SUDO_USER)
		opener = 'sudo -u ' + process.env.SUDO_USER + ' ' + opener;

	return exec(opener + ' "' + escape(target) + '"', callback);
};

/**
 * Handle navigation of page when links are clicked.
 * 
 * @param {*} webView 
 */
const handleExternalNavigation = (webView) => {
  // Navigation restricted to mainWindow only
  webView.on('will-navigate', (e, url) => {
    e.preventDefault()

    // Opening saavn urls
    if (url.replace(/https?:\/\//, '').indexOf('music.amazon.in') == 0)
      mainWindow.loadURL(url)
    else
      // Open External URLs in the default web browser
      open(url)
  });
};

/**
 * Bind Media Shortcuts and a couple of helpers
 * 
 * @param {*} webView 
 */
const bindHelperShortcuts = (webView) => {
  globalShortcut.register('MediaPlayPause', () => {
    webView.sendInputEvent({
      type: 'keyUp',
      keyCode: 'Space'
    })
  });

  globalShortcut.register('MediaNextTrack', () => {
    webView.sendInputEvent({
      type: 'keyUp',
      keyCode: 'Right'
    })
  });

  globalShortcut.register('MediaPreviousTrack', () => {
    webView.sendInputEvent({
      type: 'keyUp',
      keyCode: 'Left'
    })
	});
};
