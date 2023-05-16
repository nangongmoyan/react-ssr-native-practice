# React SSR(React 服务器端渲染)

### React SSR介绍

##### 什么是客户端渲染（CSR：Client Side Rendering）

服务器端进返回JSON数据，DATA和HTML在客户端进行渲染

##### 什么是服务器端渲染（SSR：Server Side Rendering）

服务器端进返回HTML，DATA和HTML在服务器端进行渲染

##### 客户端渲染存在的问题
- **首屏等待时间长，用户体验差**
- **页面结构为空，不利于SEO**

##### React SSR同构
同构指的是代码复用，即实现客户端和服务器端最大程度的代码复用

### 服务器啊端渲染快速开始

##### 项目结构

##### 创建Node服务器
`
import express from 'express';

const app = express();

app.use(express.static('public'));

app.listen(3000, () => console.log('app is running on 3000 port'));

export default app;
`

##### 实现React SSR

- **首屏等待时间长，用户体验差**
- **通铺renderToString方法将React组件转换为HTML字符串**
- **将结果HTML字符串响应到客户端**

renderToString方法用于将React组件转换为HTML字符串，通过react-dom/server导入

##### webpack 打包配置

问题： Node环境不支持ESModule模块系统，不支持JSX语法


##### 项目启动命令配置
- **配置服务器端打包命令：** "dev:server-build": "webpack --config webpack.server.js --watch"
- **配置服务端启动命令:：** "dev:server-run": "nodemon --watch build --exec \"node build/bundle.js\""


### 客户端React附加事件

##### 实现思路分析
在客户端对组件进行二次渲染，为组件元素附加事件 

##### 客户端二次“渲染”hydrate
使用hydrate方法对组件进行渲染，为组件元素附加事件
hydrate方法在实现渲染的时候，会复用原本已经存在的DOM节点，减少重新生成节点以及删除原本DOM节点的开销，通过react-dom导入hydrate
`
hydrate(
  document.getElementById("root"),
  <Provider store={store}>
    <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
  </Provider>

);
`

###### 客户端React打包配置
1. webpack配置
  打包目的：转换JSX语法，转换浏览器不识别的高级javascript语法
  打包目标位置：public
2.打包启动命令配置
    "dev:client-build": "webpack --config webpack.client.js --watch"

##### 添加客户端包文件请求链接
在响应给客户端的HTML代码中添加script标签，请求客户端Javascript打包文件
` 
  <html>
    <head>
      <title>React SSR</title>
    </head>
    <body>
      <div id="root">${content}</div>
      <script src="bundle.js"></script>
    </body>
  </html>
`


###### 服务器端实现静态资源访问
服务器短程序实现静态资源访问功能，客户端JavaScript打包文件会被作为静态资源使用
` app.use(express.static('public'));` 

### 优化
###### 合并webpack配置
服务端webpack和客户端webpack配置存在重复，将重复配置抽象到webpack.base.js配置文件中
`
const baseConfig = require('./webpack.base');
const { merge } = require("webpack-merge");

const config = {...}
module.exports = merge(baseConfig, config)
`

##### 合并项目启动命令
目的：使用一个命令启动项目，解决多个名利启动的繁琐问题，通过npm-run-all工具实现
` "dev": "npm-run-all --parallel dev:*" `

##### 服务器端打包文件体积优化
问题： 在服务器端打包文件中，包含Node系统模块，导致打包文件本身体积庞大，
解决： 通过webpack配置剔除打包文件中的Node模块
`
const nodeExternals = require('webpack-node-externals');
const config = {
    externals: [nodeExternals()]
}
`
###### 将启动服务器代码和渲染代码进行模块化拆分
优化代码组织方式，渲染React组件代码是独立功能，所以吧它从服务器端入口文件中进行抽离

### 路由支持
##### 实现思路
在React SSR项目中需要实现两端路由
客户端路由是用于支持用户通过点击链接的形式跳转页面
服务端路由是用于支持用户直接从浏览器地址栏中访问页面
客户端和服务器端公用一套路由规则

##### 编写路由规则
`
import Home from '../share/pages/Home';
import List from '../share/pages/List';

export default [{
  path: '/',
  component: Home,
  exact: true
}, {
  path: '/list',
  ...List
}]
`
##### 实现服务器端路由
1.Express路由接受任何请求
  Express路由接收虽有GET请求，服务器端React路由通过请求路径匹配要进行渲染的组件
  ` app.get('*', (req, res) => {}) `
2.服务器端路由配置
` 
import routes from "../share/routes";
import { renderToString } from "react-dom/server";
import { renderRoutes } from '../utils/routerConfig';
import { StaticRouter } from "react-router-dom/server";

export default req => {
  const content = renderToString(
      <StaticRouter location={req.path}>
        {renderRoutes(routes)}
      </StaticRouter>
  );
}
`
3.添加客户端路由配置
`
import routes from "../share/routes";
import { BrowserRouter } from "react-router-dom";
import { renderRoutes } from '../utils/routerConfig';

hydrate(
  document.getElementById("root"),
  <BrowserRouter>
    {renderRoutes(routes)}
  </BrowserRouter>

);
`
### Redux支持
##### 实现思路分析

在实现了React SSR的项目中需要实现两端Redux
客户端Redux就是通过客户端Javascript管理store中的数据
服务器端Redux就是在服务器端搭建一套Redux代码，用于管理组件中的数据
客户端和服务器端公用一套Reducer代码
创建Store的代码由于参数传递不用所以不可共用

##### 实现客户端Redux
1.创建Store
2.配置Store
3.创建Action和Reducer
4.配置polyfill
由于浏览器不能识别异步函数代码，所以需要polyfill进行填充

##### 实现服务器端Redux
1. 创建Store
`
import { configureStore } from "@reduxjs/toolkit";
import reducer from '../share/store/reducers';
import logger from "redux-logger";
export default () => configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
})
`
2.配置Store
`
app.get('*', (req, res) => {
  const store = createStore();
  res.send(renderer(req, store));
})
`
`
import routes from "../share/routes";
import { Provider } from "react-redux";
import { renderToString } from "react-dom/server";
import { renderRoutes } from '../utils/routerConfig';
import { StaticRouter } from "react-router-dom/server";

export default (req, store) => {
  const content = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.path}>
          {renderRoutes(routes)}
        </StaticRouter>
      </Provider>
  );
}
`

##### 服务器端store数据填充
问题：服务器端创建的store是空的，组件并不能从Store中获取任何数据
解决：服务器端在渲染组件之前获取组件所需要的数据

1.在组件中添加loadData方法，此方法用于回去组件所需数据，方法被服务器端调用
2.将lodaData方法保存在当前组件的路由信息对象中
3.服务器端在接收到请求后，根据请求地址匹配出要渲染的组件的路由信息
4.从路由信息中获取组件中的loadData方法并调用方法获取组件所需数据
5.当数据获取完成以后在渲染组件并将结果响应到客户端


- **组件lodaData方法**
服务器端通过调用组件的loadData方法获取组件所需数据并将数据存储在服务器端的Store中
`
function loadData (store) {
  /** 
  * dispacth方法的返回值是要触发的action对象
  * 但现在通过受用thunk触发action时返回的是异步函数
  * 异步函数的返回值是promise，所以此处的返回值就是promise
  */
  return store.dispatch(fetchUser())
}
`
- **服务器端获取组件所需数据**
服务器端在接收到请求后，先根据请求路径分析出要渲染的路由信息，再从路由信息中得到loadData方法
`
app.get('*', (req, res) => {
  const store = createStore();
  // 1. 请求地址 req.path
  // 2. 获取到路由配置信息 routes
  // 3. 根据请求地址匹配出要渲染的组件的路由对象信息
  const promises = matchRoutes(routes, req.path).map(({ route }) => {
    // 如何才能知道数据什么时候获取完成
    if (route.loadData) return route.loadData(store)
  })

  /** 等待数据渲染完成并对客户端做出响应 */
  Promise.all(promises).then(() => {
    res.send(renderer(req, store));
  })

});
`

### React 警告消除
原因：客户端Store在初始状态下是没有数据的，在渲染组件的时候生成的是空的ul，但是服务器端是先获取数据再进行的组件渲染，所以生成的是有子元素的ul，hydrate方法在对比的时候发现两者不一致，所以报了警告。
解决：将服务器端获取到的数据回填给客户端，让客户端有初始数据

- **服务器响应Store初始状态**
`
 const initalState =  JSON.stringify(store.getState());

  <body>
      <div id="root">${content}</div>
      <script>window.INITIAL_STATE = ${initalState} </script>
      <script src="bundle.js"></script>
    </body>
`

- **客户端设置Store初始状态**
`
export default () => configureStore({
  reducer,
  preloadedState: window.INITIAL_STATE,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
})
`

##### 防范XSS攻击

转义状态中的恶意代码
`
import serialize from 'serialize-javascript';
const initalState = serialize(store.getState());
`