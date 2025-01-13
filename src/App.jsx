import React, { Suspense, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import authService from './appwrite/auth'
import { login, logout } from './store/authSlice'
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import SomethingWentWrong from './components/errors/SomethingWentWrong.jsx'
import Loading from './components/loaders/Loading.jsx'
import MobileNavbar from './components/Header/MobileNavbar.jsx'

function App() {

  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const authStatus = useSelector((state) => state.auth.status)

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData))
        } else {
          dispatch(logout())
        }
      }) // catch user kar sakte hai
      .finally(() => setLoading(false))
  }, [])

  return (
    <ErrorBoundary fallback={<SomethingWentWrong />}>
      {!loading ? (
        <div className='min-h-screen flex flex-wrap content-between bg-white'>
          <div className='w-full flex flex-col min-h-screen'>
            <Header />
            <main className='flex-grow'>
              {/* <span className='mt-48 pt-48 text-2xl'><br />
            Welcome To TechieBlog</span>  */}
              <Suspense fallback={<Loading />}>
                <Outlet />
              </Suspense>
            </main>
            <Footer />
            { authStatus && <MobileNavbar /> }
          </div>
        </div>
      ) : <Loading />}
    </ErrorBoundary>
  )
}

export default App