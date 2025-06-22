const { spawn } = require('child_process');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    // Set the working directory to the Laravel backend
    const backendPath = path.join(__dirname, '../../backend');
    process.chdir(backendPath);

    // Set environment variables for Laravel
    process.env.APP_ENV = 'production';
    process.env.APP_DEBUG = 'false';

    // Create a PHP process to handle the request
    const php = spawn('php', ['artisan', 'serve', '--port=8000', '--host=127.0.0.1']);

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
          console.error(`PHP process exited with code ${code}`);
          reject({
            statusCode: 500,
            body: JSON.stringify({ 
              error: 'Internal Server Error',
              details: error || 'Laravel application error',
              code: code
            })
          });
        } else {
          resolve({
            statusCode: 200,
            body: output || 'Laravel application is running'
          });
        }
      });

      // Set a timeout to prevent hanging
      setTimeout(() => {
        php.kill();
        reject({
          statusCode: 504,
          body: JSON.stringify({ error: 'Gateway Timeout - Laravel application took too long to respond' })
        });
      }, 10000);
    });
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Function execution error',
        details: error.message
      })
    };
  }
}; 