import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './App.css';
import './components/TextField';
import Form from './components/Form'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "react-datepicker/dist/react-datepicker.css";
import QrProfile from './components/QRProfile';
import Table from './components/tableData';

import {
  createBrowserRouter,
  RouterProvider,
  useLocation
} from "react-router-dom";
import QRCode from 'react-qr-code';

const router = createBrowserRouter([
  {
    path: "/",
    element: <div className=" min-h-full w-full flex flex-row items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-200">
      <div className="min-h-full w-full flex flex-row items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white z-30 shadow-2xl rounded-3xl">
        <Form />
      </div>
    </div>,
  },
  {
    path: "/users",
    element: <div className=" min-h-full w-full flex flex-row items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-200 ">
      <div className="min-h-full w-full flex flex-row items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white z-30 shadow-2xl rounded-3xl">
        <Table />
      </div>
    </div>
  },
  {
    path: "/editUser",
    element: <div className=" min-h-full w-full flex flex-row items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-200">
      <div className="min-h-full w-full flex flex-row items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white z-30 shadow-2xl rounded-3xl">
        <Form />
      </div>
    </div>,
  },
  {
    path: "/user/:id",
    element:
      <QrProfile />

    ,
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <RouterProvider router={router} />

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
