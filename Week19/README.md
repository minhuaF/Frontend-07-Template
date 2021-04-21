### 学习笔记

#### NodeJS 的流

** 流式传输 ** 

流的几种形式：

1. 可读的流（不在意每次读取的大小，需要监听），最好用于处于binary格式的文件：音视频、图片等
  - event: 'close' - 读流结束
  - Event: 'data' 
1. 只能写的流, buffer排队，较复杂
1. 可读可写的流


#### 发布系统和服务器的流程
发布系统： 把文件通过http的方式传输到服务器；流式传输
服务端系统


### 鉴权

#### 流程

1. publish-tool 打开 `https://github.com/login/oauth/authorize` 进行权限校验
2. publish-server 需要 /auth 路由进行拦截：允许接受 code，用code + client_id + client_secret换token
3. publish-tool 创建server，接受token，后点击发布
4. publish-server /publish路由： 用token获取用户信息， 检查权限， 接受发布;
5. publish-tool 新增发布服务


### 疑问


