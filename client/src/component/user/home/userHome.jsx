import React, { useEffect, useState } from "react";
import userAxios from "../../../Axios/userAxios";
import { useDispatch, useSelector } from "react-redux";
import { UserLogout } from "../../../Redux/userState";
import { useNavigate } from "react-router-dom";
import Location from "../../location/location";
import { decodeJwt } from "jose";
import Cookies from "js-cookie";

function userHome() {
  const token = useSelector((store) => store.user.Token);
  const userLocation = useSelector((store) => store.user.location);
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
  const [category, setcategory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [Category, setCategory] = useState("");
  const [locationPopupVisible, setLocationPopupVisible] = useState(false);
  const [CatId, setCatId] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % carouselImages.length
      );
    }, 4000);

    const expired = isTokenExpired();
    if (expired) {
      dispatch(UserLogout());
      navigate("/");
    }
    // Clear the interval when the component unmounts to avoid memory leaks
    return () => clearInterval(interval);
  }, [navigate, token]);
  useEffect(() => {
    userAxios.get("/getCategory").then((res) => {
      if (res.data.status) {
        setcategory(res.data.category);
      } else {
        setcategory("");
      }
    });
    if(token && !userLocation){
    handleOpenLocationPopup();
    }
  }, []);
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = category.filter((category) =>
      category.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCategories(filtered);
  };
  const handleCategorySelection = (categoryName) => {
    setCategory(categoryName);
    setSearchQuery(categoryName);
    setFilteredCategories(""); // Clear the search query after selecting a category
  };
  const handleOpenLocationPopup = () => {
    setLocationPopupVisible(true);
  };
  const sendCatId = (id)=>{
    setCatId(id)
  }
  // Function to handle closing the location popup
  const handleCloseLocationPopup = () => {
    setLocationPopupVisible(false);
  };

  const searchForm = (e) => {
    e.preventDefault();
    if (
      Category.toLocaleLowerCase() !== searchQuery.toLocaleLowerCase() ||
      Category.trim().length < 3
    ) {
      console.log("Error please fill correct ");
      return;
    }

    navigate(`/Services?Category=${encodeURIComponent(Category)}&CatId=${encodeURIComponent(CatId)}`);
  };

  return (
    <div className="h-[1200px] w-full bg-red-100">
      <div className="absolute right-10" onClick={handleOpenLocationPopup}>
  <div className="relative inline-flex items-center">
    <div className="pr-1 text-xs">{userLocation ? userLocation : 'Location'}</div>
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
          <form action="" method="POST" onSubmit={searchForm}>
            <div className="flex bg-white p-6 mt-2 rounded-lg lg:w-full items-center shadow-md max-h-16">
              <div className="flex border rounded mr-1 lg:w-5/6">
                <div className="flex-grow mr-2 w-2/12">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search"
                    className="w-full px-4 py-2  rounded-lg focus:outline-none focus:ring"
                  />
                </div>
                {/* <div className="flex-grow mr-2 w-2/12">
                  <select className="w-full px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring focus:border-blue-300">
                    <option value="">Location</option>
                    <option value="category1">location 1</option>
                    <option value="category2">Location 2</option>
                    Add more options as needed
                  </select>
                </div> */}
              </div>

              <div className="flex-grow w-1/12">
                <button
                  type="submit"
                  name="search"
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                  <span className="text-sm md:text-sm">Submit</span>
                </button>
              </div>
            </div>
            {filteredCategories.length > 0 ? (
              <ul className="border border-gray-300 rounded-md overflow-y-auto max-h-28 w-1/2">
                {filteredCategories.map((cat) => (
                  <li
                    key={cat._id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    value=""
                    onClick={() => {handleCategorySelection(cat.name), sendCatId(cat._id)}}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            ) : (
              ""
            )}
          </form>
        </div>
        {/* Banner content */}
      </div>
      {locationPopupVisible && (
        <div className="fixed top-0 left-0 h-full w-full bg-black bg-opacity-50 flex items-center justify-center">
          {/* <div className="w-1/2 h-28 bg-sky-200 p-2"> */}
            <Location onCloseLocationPopup={handleCloseLocationPopup} />
          {/* </div> */}
        </div>
      )}
    </div>
  );
}

export default userHome;
