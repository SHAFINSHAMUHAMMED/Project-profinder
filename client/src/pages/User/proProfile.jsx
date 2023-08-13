import React from 'react'
import NavBar from '../../component/user/navbar/navbar'
import ProProfile from '../../component/user/proProfile/proProfile'

function proProfile() {
  return (
    <div>
      <NavBar/>
      <div className='w-4/5 flex justify-center m-auto'>
      <ProProfile/>

      </div>
    </div>
  )
}

export default proProfile
