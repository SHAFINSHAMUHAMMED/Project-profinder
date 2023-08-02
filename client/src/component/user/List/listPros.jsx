import React, { useState, useEffect } from "react";
import StarRating from "../../../component/user/starRating/StarRating";
import userAxios from "../../../Axios/userAxios";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserLogout } from "../../../Redux/userState";
import Pagination from "../../pagination/Pagination";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";



function listPros() {
  const [pros, setPros] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [prosPerPage] = useState(3);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((store) => store.user.Token);
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
      dispatch(UserLogout())
      navigate("/");
    }else{
    userAxios.get("/getPros",{
      headers: {
        Authorization: `Bearer ${token}`,
    },
    }).then((res) => {
      if(res.data.status){
      setPros(res.data.pro);
      }
    })
  };
  }, []);
  const indexOfLastPro = currentPage * prosPerPage;
  const indexOfFirstPro = indexOfLastPro - prosPerPage;
  const currentPros = pros.slice(indexOfFirstPro, indexOfLastPro);
  return (
    <>
      <div className="main">
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
                <div className="mb-1 sm:mb-0  flex-grow mr-2 sm:w-3/12">
                  <select className="w-full px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring focus:border-blue-300">
                    <option value="">Category</option>
                    <option value="category1">Category 1</option>
                    <option value="category2">Category 2</option>
                  </select>
                </div>
                <div className=" mb-1 sm:mb-0  flex-grow mr-2 sm:w-3/12">
                  <select className="w-full px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring focus:border-blue-300">
                    <option value="">Location</option>
                    <option value="location1">Location 1</option>
                    <option value="location2">Location 2</option>
                  </select>
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
            {pros.length > 0
              ? currentPros.map((pro) => {
                  return (
                      <div key={pro._id} className="bg-blue-100  h-fit p-3 pt-0 mb-1">
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
                              <h6 className="text-[12px] font-serif">
                                {pro.category[0]}
                              </h6>
                              <h6 className="text-[2vh]">
                                {pro.location ? pro.location : "Location"}
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
                          <button className="bg-blue-500 text-white button rounded-lg w-20 h-6 text-xs">
                            connect
                          </button>
                        </div>
                      </div>
                  );
                })
              : 
              <div className="flex justify-center">Not Found</div>
              }
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(pros.length / prosPerPage)}
        onPageChange={setCurrentPage}
      />
    </>
  );
}

export default listPros;
