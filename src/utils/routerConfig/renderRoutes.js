import React from "react"
import { Route, Routes } from "react-router-dom"

function renderRoutes (routes) {
  return routes ? (
    <Routes>
      {routes.map((route, i) => ((
        <Route
          {...route}
          key={route.key || i}
          element={<route.component />}
        />

      )))}
    </Routes>
  ) : null
}

export { renderRoutes }