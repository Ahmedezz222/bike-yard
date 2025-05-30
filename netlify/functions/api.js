const { spawn } = require('child_process');
const path = require('path');

exports.handler = async function(event, context) {
  // Set the working directory to the Laravel backend
  process.chdir(path.join(__dirname, '../../backend'));

  // Create a PHP process to handle the request
  const php = spawn('php', ['artisan', 'serve']);

  // Handle the request
  return new Promise((resolve, reject) => {
    let output = '';

    php.stdout.on('data', (data) => {
      output += data.toString();
    });

    php.stderr.on('data', (data) => {
      console.error(`PHP Error: ${data}`);
    });

    php.on('close', (code) => {
      if (code !== 0) {
        reject({
          statusCode: 500,
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      } else {
        resolve({
          statusCode: 200,
          body: output
        });
      }
    });
  });
}; 