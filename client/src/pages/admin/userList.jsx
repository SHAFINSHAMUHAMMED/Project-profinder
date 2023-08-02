import React,{useEffect,useState} from 'react'
import Navbar  from '../../component/admin/navbae/navbar'
import adminAxios from "../../Axios/adminAxios";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../Redux/adminState";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";
import Listig from '../../component/admin/listing/Listing'
function userList() {
    const [Users, setUsers] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [count,Setcount]=useState(0)

  const token = useSelector((store) => store.admin.Token);
  if (!token) {
    navigate("/admin/");
}
  const isTokenExpired = () => {
    const token = Cookies.get("token");
    if (token) {
      const decodedToken = decodeJwt(token);
      const currentTimestamp = Date.now() / 1000;
      return decodedToken.exp < currentTimestamp;
    }
    return true; // If there's no token, it is expired
  };
  useEffect(() => {
    const expired = isTokenExpired();
    if (expired) {
      dispatch(adminLogout())
      navigate("/admin/login");
    }else{
      adminAxios.get("/findUser",{
      headers: {
        Authorization: `Bearer ${token}`,
    },
    }).then((res) => {
      if(res.data.status){
      setUsers(res.data.user);
      }
    })
  };
  }, [count]);
  return (
    <div>
      <Navbar/>
      <Listig update={Setcount} count={count} data={Users} role='user'/>
      
    </div>
  )
}

export default userList
