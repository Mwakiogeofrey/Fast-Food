import React from 'react'
import Navbar from './components/navbar/Navbar'
import Sidebar from './components/sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Add from './pages/Add/Add'
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';

const App = () => {

  // base API URL is read from Vite environment variables
  const url = import.meta.env.VITE_API_URL || ""
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <hr/>
      <div className='app-content'>
        <Sidebar/>
        <Routes>
          <Route path="/add" element={<Add url={url}/>}/>
          <Route path="/list" element={<List url={url}/>}/>
          <Route path="/orders" element={<Orders url={url}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App