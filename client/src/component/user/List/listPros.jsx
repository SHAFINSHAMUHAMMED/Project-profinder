import React, { useState, useEffect } from "react";
import StarRating from "../../../component/user/starRating/StarRating";
import userAxios from "../../../Axios/userAxios";
import { Link, useLocation } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserLogout, userLocation } from "../../../Redux/userState";
import Pagination from "../../pagination/Pagination";
import Location from "../../location/location";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";

function listPros() {
  const [pros, setPros] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [prosPerPage] = useState(3);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryLocation = useLocation();
  const queryParams = new URLSearchParams(queryLocation.search);
  const categoryQuery = queryParams.get("Category");
  const [locationPopupVisible, setLocationPopupVisible] = useState(false);

  const token = useSelector((store) => store.user.Token);
  const location = useSelector((store)=> store.user.location)
  if (!token) {
    navigate("/");
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
      dispatch(UserLogout());
      navigate("/login");
    } else {
      userAxios
        .get("/getPros", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data.status) {
            setPros(res.data.pro);
          }
        });
    }
    if(!location){
      handleOpenLocationPopup()
    }
  }, []);
  const indexOfLastPro = currentPage * prosPerPage;
  const indexOfFirstPro = indexOfLastPro - prosPerPage;
  let currentPros = pros.slice(indexOfFirstPro, indexOfLastPro);

  const handleOpenLocationPopup = () => {
    setLocationPopupVisible(true);
  };
   // Function to handle closing the location popup
   const handleCloseLocationPopup = () => {
    setLocationPopupVisible(false);
  };

  // filter
  if (categoryQuery) {
    currentPros = pros.filter((user) => {
      console.log(user);

      const hasCat= user.category.name === categoryQuery;
      const hasLoc = user.location.location === location
  console.log(hasCat,'lllllllllll');
      
      return hasCat&&hasLoc
    });
  }else{
    currentPros = pros.filter((user)=>{
      return user.location.location === location
    })
  }
  
  return (
    <>
      <div className="main">
      <div className="absolute right-10" onClick={handleOpenLocationPopup}>
  <div className="relative inline-flex items-center">
    <div className="pr-1 text-xs">{location ? location : 'Location'}</div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 mt-1"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  </div>
</div>
        <div className="1">
          <form action="" className="flex justify-center">
            <div className="sm:flex bg-white p-3 mt-2 sm:mt-8 rounded-lg justify-evenly items-center shadow-md sm:max-h-16 w-screen sm:w-5/6 lg:w-4/6">
              <div className="  justify-center  sm:flex border  rounded mr-1 sm:w-3/4">
                <div className="mb-1 sm:mb-0 flex-grow mr-2 sm:w-3/12">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full px-4 py-2  rounded-lg focus:outline-none focus:ring"
                  />
                </div>
                
              </div>

              <div className="mt-2 sm:mt-0 flex justify-center">
                <button
                  type="button"
                  className="w- px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                  <span className="text-sm md:text-sm">Submit</span>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="2 flex justify-center mt-10">
          <div className="content flex-col justify-center p-10 mb-5 bg-gray-100 w-4/6 h-[70vh] overflow-y-scroll">
            {pros.length > 0 ? (
              currentPros.map((pro) => {
                return (
                  <div
                    key={pro._id}
                    className="bg-blue-100  h-fit p-3 pt-0 mb-1"
                  >
                    <div className="profile flex p-5 pt-2 pb-0 justify-between">
                      <div className="flex gap-2 mb-3">
                        <img
                          className="rounded w-10 h-10 bg-black"
                          src=""
                          alt=""
                        />
                        <div className="proDetails">
                          <h4 className="font-medium font-mono text-[14px] ">
                            {pro.name}
                          </h4>
                            <h6
                              className="text-[12px] font-serif"
                            >
                              {pro.category.name}
                            </h6>
                          <h6 className="text-[2vh]">
                            {pro.location.location
                              ? pro.location.location
                              : "Location"}
                          </h6>
                          <h6 className="text-[1.8vh]">
                            Charge ₹{" "}
                            {pro.charge && pro.charge.fulltime
                              ? pro.charge.fulltime
                              : 0}
                          </h6>
                        </div>
                      </div>
                      {/*StarRating component*/}
                      <div className="flex items-start">
                        <StarRating rating={4} />
                        <span className="text-xs">(25)</span>
                      </div>
                    </div>
                    {/* <div className='flex ps-5 w-3/4 m-auto mb-2'>
                   <span>
                    <h5 className='text-[10px]'>descriptions</h5>
                    </span>
                </div> */}
                    <div className="main flex items-center justify-center">
                      <div className="tags flex text-center gap-2 w-5/6">
                        <div className="bg-blue-300 flex items-center justify-center rounded-xl w-24 h-6">
                          <h6 className="text-xs ">Tags</h6>
                        </div>
                        <div className="bg-blue-300 flex items-center justify-center rounded-xl w-24 h-6">
                          <h6 className="text-xs">Tags</h6>
                        </div>
                        <div className="bg-blue-300 flex items-center justify-center rounded-xl w-24 h-6">
                          <h6 className="text-xs">Tags</h6>
                        </div>
                      </div>
                      <Link  to={'/connect'} state={{'proData':pro}} className="bg-blue-500 flex justify-center items-center text-white button rounded-lg w-20 h-6 text-xs">
                        connect
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex justify-center">Not Found</div>
            )}
          </div>
        </div>
        
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(pros.length / prosPerPage)}
        onPageChange={setCurrentPage}
      />
       {locationPopupVisible && (
        <div className="fixed top-0 left-0 h-full w-full bg-black bg-opacity-50 flex items-center justify-center">
          {/* <div className="w-1/2 h-28 bg-sky-200 p-2"> */}
            <Location onCloseLocationPopup={handleCloseLocationPopup} />
          {/* </div> */}
        </div>
      )}

      
    </>
  );
}

export default listPros;
