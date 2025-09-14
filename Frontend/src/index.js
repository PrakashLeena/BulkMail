import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import PasswordConfirmation from './PasswordConfirmation';
import './index.css';
import { useState } from 'react';
import axios from 'axios';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Application()
{

   const [users,setusers] = useState(

    [
        {
            username:"kibo",
            password:"1234"
        },

        {
            username:"Anne",
            password:"kiyu"
        }
    ]
   )

   function check(){
     const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
     var logindetails = axios.get(`${apiUrl}/login`)
   }

   return( 
   <div>
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<Login users={users} setusers={setusers}/>}></Route>
    <Route path='/Signup' element={<Signup users={users} setusers={setusers}/>}></Route>
    <Route path='/Landing' element={<App/>}></Route>
    <Route path='/PasswordConfirmation' element={<PasswordConfirmation users={users} setusers={setusers}/>}></Route>
    </Routes>
    </BrowserRouter>
   </div>)
}
root.render(
  <div>
    <Application />
    </div>

);

