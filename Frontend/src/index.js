import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import PasswordConfirmation from './PasswordConfirmation';
import './index.css';
import { useState } from 'react';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Application()
{

   const [users,setusers] = useState(

    [
        {
            username:"kibo@gmail.com",
            password:"1234qwer"
        },

        {
            username:"Anne",
            password:"kiyu"
        }
    ]
   )

   // Simple ProtectedRoute: checks a flag in localStorage set on login
   const ProtectedRoute = ({ children }) => {
    const isAuthed = !!localStorage.getItem('authUser');
    return isAuthed ? children : <Navigate to="/" replace />;
  };

   return( 
   <div>
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<Login users={users} setusers={setusers}/>}></Route>
    <Route path='/Signup' element={<Signup users={users} setusers={setusers}/>}></Route>
    <Route path='/Landing' element={<ProtectedRoute><App/></ProtectedRoute>}></Route>
    <Route path='/PasswordConfirmation' element={<PasswordConfirmation users={users} setusers={setusers}/>}></Route>
    </Routes>
    </BrowserRouter>
   </div>)
}
root.render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>
);
