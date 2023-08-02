import React from 'react'
import {Routes, Route} from 'react-router-dom'
import { useSelector} from 'react-redux'
import Userlogin from '../pages/User/userlogin'
import UserHome from '../pages/User/userHome'
import UserRegister from '../pages/User/Register'
import VerifyMail from '../pages/User/verifyMail'
import OtpLogin from '../pages/User/otpLogin'
import Service from '../pages/User/listPro'

function UserRoutes() {
  const IsAuth = useSelector((state)=> state.user)
  return (
    <div>
      <Routes>
        <Route path='/login' element={IsAuth.Token ? <UserHome/> : <Userlogin />}/>
        <Route path='/' element={<UserHome/>} />
        <Route path='/register' element={<UserRegister/>}/>
        <Route path='/verifyMail/:id' element={<VerifyMail/>}/>
        <Route path='/loginOtp' element={<OtpLogin/>}/>
        <Route path='/Services' element={<Service/>}/>

        </Routes>
    </div>
  )
}

export default UserRoutes
