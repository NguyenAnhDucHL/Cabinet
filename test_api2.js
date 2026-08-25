const http = require('http');

async function testApi() {
  // Login first
  const loginData = JSON.stringify({
    username: 'admin',
    password: '123'
  });

  const loginReq = http.request({
    hostname: 'localhost',
    port: 8080,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': loginData.length
    }
  }, (res) => {
    let cookies = res.headers['set-cookie'] || [];
    
    // Now call the schedule endpoint
    const getReq = http.request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/phonghopkhonggiayto/meetings/schedule',
      method: 'GET',
      headers: {
        'Cookie': cookies.join('; ')
      }
    }, (getRes) => {
      let data = '';
      getRes.on('data', chunk => data += chunk);
      getRes.on('end', () => console.log('Schedule:', data));
    });
    getReq.end();
  });

  loginReq.write(loginData);
  loginReq.end();
}

testApi();
