import { Router, matchPath } from "react-router-dom"


function matchRoutes (routes, pathname, branch = []) {

  routes.some(route => {
    const match = route.path
      ? matchPath(route, pathname)
      : branch.length
        ? branch[branch.length - 1].match
        : Router.computeRootMatch(pathname)

    if (match) {

      branch.push({ route, match })
      if (route.routes) {
        matchRoutes(route.routes, pathname, branch)
      }
    }

    return match
  })
  return branch
}

export { matchRoutes }