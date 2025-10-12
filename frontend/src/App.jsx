
import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './HomePage/HomePage.tsx'
import ProfileUI from './ProfileLayout/ProfileUI.tsx'
import { AuthProvider } from '../Auth/AuthContext.tsx'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/profile' element={<ProfileUI />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
