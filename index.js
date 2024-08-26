const path = require('path');
const config = require('./config');
const { connect } = require('./lib/client.js');
const fetchFiles = require('./lib/modules.js');
const { getandRequirePlugins } = require('./lib/database/plugins');
global.__basedir = __dirname;
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot Connected');
});

const server = app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000');
  runBot();
});

async function runBot() {
  try {
    await fetchFiles(path.join(__dirname, '/lib/database/'));
    console.log('Syncing Database');

    await config.DATABASE.sync();

    console.log('⬇  Installing Plugins...');
    await fetchFiles(path.join(__dirname, '/plugins/'));
    await getandRequirePlugins();
    console.log('✅ Plugins Installed!');
    return await connect();
  } catch (error) {
    console.error('Initialization error:', error);
    process.exit(1);
  }
}
