const { spawn } = require('child_process');
const path = require('path');

exports.handler = async function(event, context) {
  // Set the working directory to the Laravel backend
  const backendPath = path.join(__dirname, '../../backend');
  process.chdir(backendPath);

  // Create a PHP process to handle the request
  const php = spawn('php', ['artisan', 'serve', '--port=8000']);

  // Handle the request
  return new Promise((resolve, reject) => {
    let output = '';
    let error = '';

    php.stdout.on('data', (data) => {
      output += data.toString();
    });

    php.stderr.on('data', (data) => {
      error += data.toString();
      console.error(`PHP Error: ${data}`);
    });

    php.on('close', (code) => {
      if (code !== 0) {
        reject({
          statusCode: 500,
          body: JSON.stringify({ 
            error: 'Internal Server Error',
            details: error
          })
        });
      } else {
        resolve({
          statusCode: 200,
          body: output
        });
      }
    });

    // Set a timeout to prevent hanging
    setTimeout(() => {
      php.kill();
      reject({
        statusCode: 504,
        body: JSON.stringify({ error: 'Gateway Timeout' })
      });
    }, 10000);
  });
}; 