import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { proLogout } from "../../../Redux/professionalsState";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";
import "./proHome.css";

function proHome() {
  const token = useSelector((store) => store.professional.Token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    if(expired){
      dispatch(proLogout())
      navigate('/professional/')
    }
  
  }, [navigate,token])
  
  return (
    <div className="stats-holder flex-col gap-4 flex mt-2 basis-1 sm:flex-row">
      <div className="stats basis-full sm:basis-3/4 ">
        <div className="cards flex flex-row gap-2 h-[9rem] sm:gap-3 sm:flex-row md:gap-2 justify-center">
          <div className="card bg-green-400  w-3/12"></div>
          <div className="card bg-green-400  w-3/12"></div>
          <div className="card bg-green-400  w-3/12"></div>
        </div>
        <div className="graph bg-green-600 h-[20rem] overflow-y-scroll  mt-5"></div>
      </div>
      <div className="rightbar h-28 sm:h-auto sm:basis-1/4 bg-green-400 "></div>
    </div>
  );
}

export default proHome;
