import React, { useState, useEffect } from 'react';
import userAxios from '../../Axios/userAxios';
import { useDispatch } from "react-redux";
import { userLocation } from "../../Redux/userState";


function Location({ onCloseLocationPopup }) {

  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocation, setFilteredLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    userAxios.get('/getLocation').then((res) => {
      if (res.data.status) {
        setLocations(res.data.location);
      }
    });
  dispatch(userLocation({ location: selectedLocation }));

  }, [selectedLocation]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = locations.filter((location) =>
      location.location.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredLocation(filtered);
  };

  const handleLocationSelection = (locationName) => {
    setSelectedLocation(locationName);
    setSearchQuery(locationName);
    setFilteredLocation([]); // Clear the search results
    
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Select a Location</h3>
              <div className="mt-5">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search"
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring"
                />
                {filteredLocation.length > 0 ? (
                  <ul className="border border-gray-300 rounded-md mt-2 max-h-28 overflow-y-auto">
                    {filteredLocation.map((loc) => (
                      <li
                        key={loc._id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        value=""
                        onClick={() => handleLocationSelection(loc.location)}
                      >
                        {loc.location}
                      </li>
                    ))}
                  </ul>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
              onClick={() => onCloseLocationPopup(selectedLocation)}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Location;