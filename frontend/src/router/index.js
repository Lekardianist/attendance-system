import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Attendance from '../pages/Attendance';
import Employees from '../pages/Employees';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import PrivateRoute from './PrivateRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'attendance',
        element: <Attendance />,
      },
      {
        path: 'employees',
        element: <Employees />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);