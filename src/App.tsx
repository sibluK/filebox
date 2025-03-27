import { SignUp } from "@clerk/clerk-react"
import { Routes, Route } from 'react-router'
import './App.css'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Files from './pages/Files'
import { ToastContainer, Bounce } from 'react-toastify';
import ProtectedRoute from "./components/ProtectedRoute"
import Lightbox from "./components/Lightbox"
import "./styles/lightbox.css"

function App() {

  return (
    <>
      <Navbar />
      <div className='content'>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/files' element={<ProtectedRoute><Files /></ProtectedRoute>} />
          <Route path='/sign-up' element={<SignUp />} />
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
        />
        <Lightbox />
      </div>
    </>
  )
}

export default App
