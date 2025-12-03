import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './HomePage/HomePage.tsx'
import ProfileUI from './Layout/ProfileLayout/ProfileUI.tsx'
import { AuthProvider, useAuth } from '../Auth/AuthContext.tsx'
import ProfileSettingUI from "./Layout/ProfileLayout/ProfileSettingUICPN/ProfileSettingUI.tsx"
import XConnectCallbackUI from "./Layout/ProfileLayout/XConnectCallbackUI/XConnectCallbackUI.tsx"
import CreateCollectionLayout from './Layout/CreateCollectionLayout/CreateCollectionLayout.tsx'
import { NotificationProvider } from './components/Notification/NotificationContext.tsx'
import { WalletProvider } from './contexts/WalletContext.tsx'

function AppRoutes() {
  const { isLoggedIn } = useAuth();
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/profile' element={<ProfileUI />} />
      <Route
        path="/:walletaddress"
        element={<ProfileUI />}
      />
      <Route path='/settings/profile' element={<ProfileSettingUI />} />
      <Route path='/oauth/x/callback' element={<XConnectCallbackUI />} />
      <Route
        path="/:walletaddress/creating"
        element={<ProfileUI />}
      />
      <Route
        path="/:walletaddress/created"
        element={<ProfileUI />}
      />
      <Route
        path="/:walletaddress/gallery"
        element={<ProfileUI />}
      />
      <Route
        path="/:walletaddress/items"
        element={<ProfileUI />}
      />
      <Route
        path="/:walletaddress/tokens"
        element={<ProfileUI />}
      />
      <Route
        path="/:walletaddress/listings"
        element={<ProfileUI />}
      />
      <Route
        path="/:walletaddress/offers"
        element={<ProfileUI />}
      />
      <Route
        path="/:walletaddress/portfolio"
        element={<ProfileUI />}
      />
      <Route
        path="/:walletaddress/watchlist"
        element={<ProfileUI />}
      />
      <Route
        path="/:walletaddress/favorite"
        element={<ProfileUI />}
      />
      <Route
        path="/:walletaddress/item/:itemId/:contractAddress"
        element={<ProfileUI />}
      />
        <Route
        path="/studio/create/collection"
        element={<CreateCollectionLayout />}
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </WalletProvider>
    </AuthProvider>
  )
}

export default App