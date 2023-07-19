# vscode-mobile
这是一个移动端的简单vscode编辑器，开发目标是
在移动设备（手机和平板）上有一个体验良好的代码编辑器

该项目使用`ionic`和`vue3`作为应用框架，使用`vscode-api`和
`monaco-editor`作为编辑器核心。
## 构建和编译
需要环境`nodejs 18+`，如需编译安卓apk则还需要
安卓开发工具

安装:
```
git clone https://github.com/aiselp/vscode-mobile.git
cd vscode-mobile
npm install
npm run postinstall
```
运行调试:
```js
npm run dev
```
编译:
```js
npm run build
```
编译安装apk
```js
npm run build
npx cap copy
//打开安卓工作室
npx cap open
//点击运行按钮
```
