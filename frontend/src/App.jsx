import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './HomePage/HomePage.tsx'
import ProfileUI from './ProfileLayout/ProfileUI.tsx'
import { AuthProvider, useAuth } from '../Auth/AuthContext.tsx'
import ProfileSettingUI from "./ProfileLayout/ProfileSettingUICPN/ProfileSettingUI.tsx"

function AppRoutes() {
  const { isLoggedIn } = useAuth();
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
  =
      <Route 
        path="/:walletaddress" 
        element={<ProfileUI />} 
      />
      <Route path='/settings/profile' element={<ProfileSettingUI />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App