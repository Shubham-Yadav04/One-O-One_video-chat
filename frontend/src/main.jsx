
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { SocketProvider } from './ContextProviders/Socket.jsx'
import { PeerProvider } from './ContextProviders/Peer.jsx'
import { UserDataProvider } from './ContextProviders/User.jsx'

createRoot(document.getElementById('root')).render(
  <UserDataProvider>
    <SocketProvider>
      <PeerProvider>
       
    <App />
   
   </PeerProvider>
   </SocketProvider>
    </UserDataProvider>

)
