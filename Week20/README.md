## 学习笔记

### 1. Git Hooks
Git 能在特定的重要动作发生时触发自定义脚本。 [官方说明](https://git-scm.com/book/zh/v2/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-Git-%E9%92%A9%E5%AD%90)

- 客户端脚本
  类似提交和合并等操作

- 服务器端脚本
  类似接收被推送的提交等联网操作


**Git hooks在 `./git/hooks/` 目录下**

### 2. ESLint
代码更改检查，一般公司都会有独立的eslint配置；

除了 `ESLint`，还有其他类似的 `styleLint，` `jsLint` 等
