import React from 'react'
import {Routes, Route} from 'react-router-dom'
import { useSelector} from 'react-redux'
import VerifyMail from '../pages/Professionals/proVerifyMail'
import Register from '../pages/Professionals/RegisterPro'
import Login from '../pages/Professionals/prologin'
import OtpLogin from '../pages/Professionals/otpLogin'
import ProHome from '../pages/Professionals/proHome'



function professionals() {
  const IsAuth = useSelector((state)=> state.user)

  return (
    <div>
      <Routes>
        <Route path='/' element={<ProHome/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/loginOtp' element={<OtpLogin/>}/>
        <Route path='/verifyMail/:id' element={<VerifyMail/>}/>


      </Routes>
    </div>
  )
}

export default professionals
