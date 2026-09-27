const http = require('http');

const request = (path) => {
  return new Promise((resolve, reject) => {
    http.get({
      hostname: '127.0.0.1',
      port: 5000,
      path: path
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
};

(async () => {
  try {
    const current = await request('/api/location/current?deviceId=test-device-123');
    console.log('CURRENT:', current.status, current.data);
    
    const history = await request('/api/location/history?deviceId=test-device-123');
    console.log('HISTORY:', history.status, history.data.substring(0, 200));

    const timeline = await request('/api/location/timeline?deviceId=test-device-123');
    console.log('TIMELINE:', timeline.status, timeline.data);
  } catch (e) {
    console.error(e);
  }
})();
