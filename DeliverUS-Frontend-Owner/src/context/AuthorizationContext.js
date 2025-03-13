import React, { createContext, useState } from 'react'

const AuthorizationContext = createContext()

const AuthorizationContextProvider = props => {
  const [loggedInUser, setLoggedInUser] = useState(null)

  return (
    <AuthorizationContext.Provider value={{
      loggedInUser,
    }}
    >
      {props.children}
    </AuthorizationContext.Provider>
  )
}

export { AuthorizationContext }
export default AuthorizationContextProvider
