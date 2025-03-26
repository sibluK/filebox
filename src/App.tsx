import { SignUp } from "@clerk/clerk-react"
import { Routes, Route } from 'react-router'
import './App.css'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Files from './pages/Files'
import { ToastContainer, Bounce } from 'react-toastify';

function App() {

  return (
    <>
      <Navbar />
      <div className='content'>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/profile' element={<Profile />} />
          <Route path='/files' element={<Files/>} />
          <Route path='/sign-up' element={<SignUp />} />
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
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
      </div>
    </>
  )
}

export default App
