import React, { useState, useEffect } from 'react'
import mockUser from './mockData.js/mockUser'
import mockRepos from './mockData.js/mockRepos'
import mockFollowers from './mockData.js/mockFollowers'
import axios from 'axios'

const rootUrl = 'https://api.github.com'

const GithubContext = React.createContext()

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser)
  const [githubRepos, setGithubRepos] = useState(mockRepos)
  const [githubFollowers, setGithubFollowers] = useState(mockFollowers)
  const [requests, setRequests] = useState(null)
  const [error, setError] = useState({ msg: '' })
  const [user, setUser] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const remainingRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then((responce) => {
        setRequests(responce.data.rate.remaining)

        if (requests === 0) {
          setError({ msg: "You're out of limit" })
        }
        setError({ msg: '' })
      })
      .catch((e) => {
        console.log(e.error)
      })
  }

  useEffect(() => {
    remainingRequests()
  }, [githubUser])

  const handleSearch = (e) => {
    setIsLoading(true)
    axios
      .all([
        axios.get(`${rootUrl}/users/${user}`),
        axios.get(`${rootUrl}/users/${user}/followers`),
        axios.get(`${rootUrl}/users/${user}/repos?per_page=100`),
      ])
      .then(
        axios.spread((user, followers, repos) => {
          setIsLoading(false)
          if (user) {
            setGithubUser(user.data)
            setGithubFollowers(followers.data)
            setGithubRepos(repos.data)
            setError({ msg: '' })
          }
        })
      )
      .catch((errors) => {
        setIsLoading(false)
        if (errors.code === 'ERR_BAD_REQUEST') {
          setError({
            msg: "Couldn't find the user, Maybe the user isn't exist.",
          })
        }
      })
    e.preventDefault()
  }

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        githubRepos,
        githubFollowers,
        requests,
        error,
        setError,
        handleSearch,
        user,
        setUser,
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}

export const useGlobalContext = () => {
  return React.useContext(GithubContext)
}

export { GithubProvider }
