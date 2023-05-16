import app from './http';
import renderer from './renderer';
import routes from '../share/routes';
import createStore from './createStore';
import { matchRoutes } from '../utils/routerConfig';

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