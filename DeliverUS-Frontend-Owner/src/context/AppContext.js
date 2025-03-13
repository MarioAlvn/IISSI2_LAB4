import React, { useState, createContext } from 'react'

const AppContext = createContext()

const AppContextProvider = props => {

  return (
    <AppContext.Provider value={{
    }}
    >
      {props.children}
    </AppContext.Provider>
  )
}
export { AppContext }
export default AppContextProvider
