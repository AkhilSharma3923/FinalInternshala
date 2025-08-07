import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import CreatePost from './components/CreatePost'
import Profile from './pages/Profile'

const App = () => {
  return (
    <>
     <Navbar /> 

     <Routes>
       <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path='/profile' element={<Profile /> } />
     </Routes>


     <Footer />
    </>
  )
}

export default App
