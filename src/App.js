import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './protectedRoutes';
import { ProtectedRouteTypes } from './utils/enums';
import Login from './containers/Login';
import Dashboard from './containers/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute
              type={ProtectedRouteTypes.DOUBLE}
              mainComponent={Dashboard}
              fallbackComponent={Login}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
