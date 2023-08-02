import React, { useEffect, useState } from "react";
import userAxios from "../../../Axios/userAxios";
import { useDispatch, useSelector } from "react-redux";
import { UserLogout } from "../../../Redux/userState";
import { useNavigate } from "react-router-dom";
import { decodeJwt } from "jose";
import Cookies from "js-cookie";

function userHome() {
  const token = useSelector((store) => store.user.Token);
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

  const carouselImages = [
    "/banner/background1.png",
    "/banner/background2.png",
    "/banner/background3.png",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => { 
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % carouselImages.length
      );
    }, 4000);
    
    const expired = isTokenExpired();
    if (expired) {
      dispatch(UserLogout())
      navigate("/");
    }
    // Clear the interval when the component unmounts to avoid memory leaks
    return () => clearInterval(interval);
  }, [carouselImages.length,navigate, token]);

  return (
    <div className="h-[1200px] w-full bg-red-100">
      <div
        className="flex p-5 w-full h-[210px] bg-cover items-start justify-start sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[770px]"
        style={{
          backgroundImage: `url(${carouselImages[currentImageIndex]})`,
        }}
      >
        <div className="text-left lg:ml-11 lg:mt-16 xl:ml-28 xl:mt-28 max-w-sm md:max-w-screen-lg">
          <div className="Heading1 text-blue-600 text-sm font-semibold capitalize leading-loose">
            We Have 1000+ Professionals
          </div>
          <div className=" text-black text-2xl md:text-3xl font-extrabold">
            Find The{" "}
            <span className="text-blue-600 text-2xl md:text-3xl font-extrabold">
              Skilled Professionals
            </span>{" "}
          </div>
          <div className=" text-sky-950 text-2xl md:text-3xl font-extrabold ">
            That Fits Your Requirement
          </div>
          <div className=" text-sky-950 text-xs ">
            Explore our extensive network of highly skilled professionals ready
            to provide exceptional
            <br />
            service and expertise, meeting your diverse employment needs.
          </div>
          <form action="">
            <div className="flex bg-white p-6 mt-2 rounded-lg lg:w-5/6 items-center shadow-md max-h-16">
              <div className="flex border rounded mr-1 lg:w-5/6">
                <div className="flex-grow mr-2 w-2/12">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full px-4 py-2  rounded-lg focus:outline-none focus:ring"
                  />
                </div>
                <div className="flex-grow mr-2 w-2/12">
                  <select className="w-full px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring focus:border-blue-300">
                    <option value="">Category</option>
                    <option value="category1">Category 1</option>
                    <option value="category2">Category 2</option>
                    {/* Add more options as needed */}
                  </select>
                </div>
                <div className="flex-grow mr-2 w-2/12">
                  <select className="w-full px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring focus:border-blue-300">
                    <option value="">Location</option>
                    <option value="location1">Location 1</option>
                    <option value="location2">Location 2</option>
                    {/* Add more options as needed */}
                  </select>
                </div>
              </div>

              <div className="flex-grow w-1/12">
                <button
                  type="button"
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                  <span className="text-sm md:text-sm">Submit</span>
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* Banner content */}
      </div>
    </div>
  );
}

export default userHome;
