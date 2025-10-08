
import './App.css'
import { Router } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import HomePage from './HomePage/HomePage.tsx'
import ProfileUI from './ProfileLayout/ProfileUI.tsx'
function App() {


  return (
    <>
      
             <Routes >
                <Route path='/' element={<HomePage></HomePage>} />\
                <Route path='/profile' element={<ProfileUI></ProfileUI>} />
             </Routes>
       
    </>
  )
}

export default App
