import { SignUp } from "@clerk/clerk-react"
import { Routes, Route } from 'react-router'
import './App.css'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Files from './pages/Files'
import { ToastContainer, Bounce } from 'react-toastify';
import ProtectedRoute from "./components/ProtectedRoute"
import Lightbox from "./components/Lightbox"
import "./styles/lightbox.css"
import FilePage from "./pages/FilePage"
import { ThemeProvider } from "./context/ThemeProvider"

function App() {

  return (
    <>
      <ThemeProvider>
        <Navbar />
        <div className='content'>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/files' element={<ProtectedRoute><Files /></ProtectedRoute>} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/files/:id/:name' element={<FilePage />} />
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
        </ThemeProvider>
    </>
  )
}

export default App
