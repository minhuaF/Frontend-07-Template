/**
 * 发布服务器
 */
const http = require('http');
const archiver = require('archiver'); // 文件系统
const child_process = require('child_process'); // node 子进程
const querystring = require('querystring'); // 获取query对象的参数

const PORT = '8082';


// 1. publish-tool 打开 `https://github.com/login/oauth/authorize` 进行权限校验
child_process.exec(`open https://github.com/login/oauth/authorize?client_id=Iv1.cb34c6db2581dbae`);

// 3. publish-tool 创建server，接受token，后点击发布
http.createServer(function (request, response) {
  const querys = querystring.parse(request.url.match(/^\/\?([\s\S]+$)/)[1]);
  publish(querys.token);
}).listen(8083)


// 发送请求
function publish(token) {
  const request = http.request({  // request是流的方式
    hostname: '127.0.0.1',
    port: 8082,
    method: 'POST',
    path: "/publish?token=" + token,
    headers: {
      'Content-Type': 'application/octet-stream' // 传输流的格式
    }
  }, response => {
    console.log('response:', response)
  });

  const archive = archiver('zip', {
    zlib: {level: 9}
  })

  archive.directory('./sample/', false);
  archive.finalize();
  archive.pipe(request);
}

// /**
//  * define request 
//  */
// const request = http.request({  // request是流的方式
//   hostname: '127.0.0.1',
//   port: PORT,
//   method: 'POST',
//   paht: '/publish',
//   headers: {
//     'Content-Type': 'application/octet-stream' // 传输流的格式
//   }

// }, response => {
//   console.log('response:', response)
// })

// /**
//  * read the file and send the request
//  */
// const file = fs.createReadStream('./sample.html');  
// file.on('data', chunk => {
//   // console.log('file content：',chunk.toString());
//   // push the file into request
//   request.write(chunk);
// })

// file.on('close', chunk => {
//   console.log('read finished');
//   request.end(chunk);
// })


