const http = require('http');

http.createServer((request, response) => {
  let body = [];
  request.on('error', (err) => {
    console.warn('===server error', err)
  }).on('data', (chunk) => {
    console.log('===chunk', chunk)
    body.push(chunk.toString())
  }).on('end', () => {
    body = Buffer.concat([Buffer.from(body.toString())]).toString();
    console.log('body', body);
    response.writeHead(200, {
      'Content-Type': 'text/html'
    })
    response.end(`
<html lang="en">
  <head>
    <style>
      body {
        background: red
      }
    </style>
  </head>
  <body>
      <div>
        <img id="img"/>
        <p>123</p>
      </div>
  </body>
</html>
    `);
  })
}).listen(8088);

console.log('server started')