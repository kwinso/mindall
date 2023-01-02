import React, { Children } from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App'
import { AlertTemplate } from './components/alert';
import { Provider as AlertProvider } from 'react-alert'
import './index.sass'
import Snowfall from 'react-snowfall';
import packageInfo from "../package.json"
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { Header } from './components/header';
import { HomePage } from './pages/home';
import { NotFoundPage } from './pages/notFound';
import { ChatPage } from './pages/chat';


function checkIfNewYear() {
  const date = new Date();
  const month = date.getMonth()
  const day = date.getDate();

  // New year time is between Dec 15 and Jan 10
  return (month == 11 && day > 15) || (month == 0 && day < 10)
}

const isNewYearTime = checkIfNewYear();

function MainLayout() {

  return <AlertProvider template={AlertTemplate} position="top center" transition="scale" timeout={2700} containerStyle={{ paddingTop: "50px" }} >

    <div className="App">
      <Header isNewYearTime={isNewYearTime} />

      <Outlet />

      <div className="footer">
        Mindall v{packageInfo.version}
        <br />
        By <a href={packageInfo.author.url}>{packageInfo.author.name}</a>
      </div>
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
      {
        path: "/chat",
        element: <ChatPage />,
      },
    ]
  },
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>

    {isNewYearTime &&
      <Snowfall snowflakeCount={20} speed={[1, 0]} style={{ zIndex: 10 }} />
    }

    <RouterProvider router={router} />
  </React.StrictMode>,
)
