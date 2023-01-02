import React from 'react'
import ReactDOM from 'react-dom/client'
import { AlertTemplate } from './components/alert';
import { Provider as AlertProvider } from 'react-alert'
import './index.sass'
import Snowfall from 'react-snowfall';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { Header } from './components/header';
import { HomePage } from './pages/home';
import { NotFoundPage } from './pages/notFound';
import { ChatPage } from './pages/chat';
import { checkNewYearTime } from './utils/newYear';

function MainLayout() {

  return <AlertProvider template={AlertTemplate} position="top center" transition="scale" timeout={2700} containerStyle={{ paddingTop: "50px" }} >

    <div className="App">
      <Header />

      <Outlet />
    </div>
  </AlertProvider>
}


const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ]
  },
  {
    path: "/chat",
    element: <ChatPage />,
  },
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>

    {checkNewYearTime() &&
      <Snowfall snowflakeCount={20} speed={[1, 0]} style={{ zIndex: 10 }} />
    }

    <RouterProvider router={router} />
  </React.StrictMode>,
)
