import React, { useEffect } from 'react'
import AllRoutes from 'views/routes'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from 'context/UserContext'
import { PetProvider } from 'context/PetContext'
import { ToastContainer } from 'react-toastify'
import { GlobalHistory } from 'components/globalhistory'
import 'react-toastify/dist/ReactToastify.css'
import { ServiceProvider } from 'context/ServiceContext'
const App = () => {
  useEffect(() => {
    // Setup local storage
    if (!localStorage.getItem('collapsed')) {
      localStorage.setItem('collapsed', false)
    }
    if (!localStorage.getItem('selected_sidebar_key')) {
      localStorage.setItem('selected_sidebar_key', 1)
    }
  }, [])

  return (
    <>
      <UserProvider>
        <ServiceProvider>
          <PetProvider>
            <BrowserRouter>
              <GlobalHistory />
              <AllRoutes />
            </BrowserRouter>
          </PetProvider>
        </ServiceProvider>
      </UserProvider>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App
