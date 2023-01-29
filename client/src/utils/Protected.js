import React from 'react'
import { Navigate } from 'react-router-dom'
function Protected({ isSignedIn, children }) {
    console.log(isSignedIn)
  if (isSignedIn !== "ADMIN_ROLES") {
    return <Navigate to="/error" replace />
  }
  return children
}
export default Protected