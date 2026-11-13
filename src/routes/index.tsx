import { createBrowserRouter } from 'react-router-dom';
import SiteLayout from '../layouts/SiteLayout';
import Home from '../pages/Home';
import Feed from '../pages/Feed';
import Docs from '../pages/Docs';
import Report from '../pages/Report';
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/feed', element: <Feed /> },
      { path: '/docs', element: <Docs /> },
      { path: '/c/:id', element: <Report /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
