import React from 'react'
import { Outlet } from 'react-router-dom'

function MyAccount() {
  return (
    <div>
      myAccount
      <Outlet/>
    </div>
  )
}

export default MyAccount
