import React, { useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

const Layout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/') // redirect to login when no token
  }, [navigate])

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/financer">
            <span>💸 Personal Expense Tracker</span>
          </Link>
          <div className="d-flex">
            <Link to="/financer/profile" className="btn btn-primary me-2">
              Your Profile
            </Link>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Outlet />
      </main>
    </>
  )
}

export default Layout