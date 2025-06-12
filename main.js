const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile('index.html');
}

// Ouve o evento de cadastro do usuário
ipcMain.handle('cadastrar-usuario', async (event, usuario) => {
  try {
    // Aqui, você pode implementar a lógica para salvar o usuário,
    // como persistência no banco de dados ou qualquer outra ação.
    
    // Exemplo de sucesso fictício:
    console.log('Usuário cadastrado:', usuario);
    
    // Simular sucesso:
    return { success: true };
  } catch (error) {
    // Se houver um erro, envie-o de volta
    return { error: error.message };
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
