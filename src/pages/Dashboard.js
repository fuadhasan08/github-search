import React, { useEffect } from 'react'
import { Info, Repos, User, Search, Navbar } from '../components'
import loadingImage from '../images/preloader.gif'
import { useGlobalContext } from '../context/context'
import { useAuth0 } from '@auth0/auth0-react'
const Dashboard = () => {
  const { isLoading } = useGlobalContext()

  const { isAuthenticated, loading } = useAuth0()

  if (isLoading) {
    return (
      <main>
        <Navbar />
        <Search />
        <img src={loadingImage} alt='Loading' className='loading-img' />
      </main>
    )
  } else {
    return (
      <main>
        <Navbar />
        <Search />
        <Info />
        <User />
        <Repos />
      </main>
    )
  }
}

export default Dashboard
