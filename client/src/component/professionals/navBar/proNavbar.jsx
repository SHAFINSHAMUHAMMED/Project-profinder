import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { proLogout } from "../../../Redux/professionalsState";
const ProNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const proname = useSelector((state) => state.professional.proName);

  const logout = () => {
    dispatch(proLogout());
    navigate("/professional/login");
  };
  return (
    <nav className="w-full h-[4rem] bg-white p-4 rounded-br-3xl rounded-bl-3xl md:block hidden">
      <div className="max-w-6xl mx-auto ">
        <div className="flex  justify-end pe-5 items-center gap-10">
          {/* <div className="text-black font-bold text-xl">My Website</div> */}
          <div className="flex gap-2 place-items-center">
            <img
              className="sm:h-9 w-9 rounded-full "
              src="/loginpage/man.png"
              alt=""
            />
            {proname ? <h3>{proname}</h3> : <h3>Name</h3>}
          </div>

          <h3 onClick={logout}>{proname ? "Sign out" : "sign In"}</h3>
        </div>
      </div>
    </nav>
  );
};

export default ProNavbar;
