/**
 * 服务端代码
 */
const http = require('http');
const https = require('https');
const unzipper = require('unzipper');
const querystring = require('querystring'); // 获取query对象的参数


// 2. publish-server 需要 /auth 路由进行拦截：允许接受 code，用code + client_id + client_secret换token
function auth(request, response) {
  const { code } = querystring.parse(request.url.match(/^\/auth\?([\s\S]+$)/)[1]);
  getToken(code, info => {
    // response.write(JSON.stringify(info));
    response.write(`<a href='http://localhost:8083/?token=${info.access_token}'>publish</a>`)
    response.end();
  })
}

// 发起请求获取token
function getToken(code, callback) {
  let request = https.request({
    hostname: 'github.com',
    path: `/login/oauth/access_token?code=${code}&client_id=Iv1.cb34c6db2581dbae&client_secret=9494152d7958adfdcf3d1028a90c25d49db31320`,
    port: 443,
    method: 'POST'
  }, function(response) {
    let body = '';
    response.on('data', chunk => {
      body += chunk.toString();
    })

    response.on('end' , chunk => {
      callback(querystring.parse(body));
    })
  })

  request.end();
}

// 4. publish-server /publish路由： 用token获取用户信息， 检查权限， 接受发布
function publish(request, response) {
  const { token } = querystring.parse(request.url.match(/^\/publish\?([\s\S]+$)/)[1]);
  console.log(2)
  getUser(token, info => {
    console.log('publish info   ', info)
    if(info.login === 'minhuaF') {
      request.pipe(unzipper.Extract({
        path: '../server/public/'
      }))
      request.on('end', chunk => {
        response.end('Success！')
      })
    }
  })
}

// 5. 获取用户信息
function getUser(token, callback) {
  let request = https.request({
    hostname: 'api.github.com',
    path: `/user`,
    port: 443,
    method: 'GET',
    headers: {
      Authorization: `token ${token}`,
      "User-Agent": 'miwa-toy-publish'
    }
  }, function(response) {
    let body = '';
    response.on('data', chunk => {
      body += chunk.toString();
    })

    response.on('end' , chunk => {
      callback(JSON.parse(body));
    })
  })

  request.end();
}

http.createServer(function(request, response) {
  const { url } = request;
  if(url.match(/^\/auth\?/)) return auth(request, response);
  if(url.match(/^\/publish\?/)) return publish(request, response);

  // console.log('request headers:', request.headers);

  // let outFile = fs.createWriteStream('../server/public/index.html');

  // request.on('data', chunk => {
  //   outFile.write(chunk);
  // })

  // request.on('end', chunk => {
  //   outFile.end();
  //   response.end('Success');
  // })

}).listen(8082)