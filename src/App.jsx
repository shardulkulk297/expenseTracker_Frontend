import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Layout from './components/Financer/Layout'
import FinancerDashboard from './components/Financer/FinancerDashboard'

function App() {
  

  return (
    <>
       <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="financer" element={<Layout />}>
            <Route index element={<FinancerDashboard />} />
          </Route>

        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
