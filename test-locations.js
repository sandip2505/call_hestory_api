const http = require('http');

const data = JSON.stringify({
  deviceId: 'test-device-123',
  locations: [
    {
      latitude: 23.000,
      longitude: 72.000,
      accuracy: 10,
      altitude: 50,
      speed: 0,
      bearing: 0,
      batteryLevel: 80,
      timestamp: new Date().toISOString()
    }
  ]
});

const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/location/sync',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', d => process.stdout.write(d));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
