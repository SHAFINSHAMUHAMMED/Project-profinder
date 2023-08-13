import React from 'react'
import UserHome from '../../component/user/home/userHome'
import NavBar  from '../../component/user/navbar/navbar'
import proAxios from '../../Axios/professionalsAxios'
function userHome() {
  
  return (
    <div>
      <NavBar/>
      <UserHome/>
    </div>
  )
}

export default userHome
