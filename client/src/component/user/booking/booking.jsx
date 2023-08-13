import React,{useState,useEffect} from 'react'
import userAxios from '../../../Axios/userAxios'
import { useSelector,useDispatch } from "react-redux";


function booking({userBookings,update,count}) {
    const token = useSelector((state) => state.user.Token);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);
    function formatDate(dateString) {
        const options = { weekday: 'short', day: 'numeric', month: 'long' };
        const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
        return formattedDate;
      }

      function handleCancelClick(bookingId) {
        setBookingToCancel(bookingId);
        setShowConfirmation(true);
      }
    
      function handleCancelConfirm() {
        if (bookingToCancel) {
          cancellJob(bookingToCancel);
          setShowConfirmation(false);
          setBookingToCancel(null);
        }
      }
    
      function handleCancelCancel() {
        setShowConfirmation(false);
        setBookingToCancel(null);
      }

      function cancellJob(id){
        userAxios.post('/cancellJob', 
        {id},
        {
          headers: {
            Authorization: `Bearer ${token}`,
         },
        }
        ).then((res)=>{
            if(res.data.status){
                update(count+1)

            }
        }).catch((error)=>{
          console.log(error);
        })
      }

  return (
    <div className="w-full mx-auto mb-5">
    {userBookings.length > 0 ? (
      userBookings.map((booking) => (
        <div
          key={booking._id}
          className="flex justify-around items-center bg-white border border-gray-600 rounded-lg gap-1 p-1 sm:p-4 mb-1"
        >
           <div className="text-center">
              <h4 className="text-md sm:text-lg font-semibold">
                {formatDate(booking.date).split(',')[0]} {/* Short weekday */}
              </h4>
              <h1 className="text-2xl sm:text-4xl font-extrabold">
                {new Date(booking.date).getDate()} {/* Day */}
              </h1>
              <h4 className="text-md sm:text-lg font-semibold">
                {new Date(booking.date).toLocaleDateString(undefined, { month: 'long' })}
              </h4>
            </div>
          <div className="w-1 h-16 bg-gray-500"></div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <img
                src="/icons/clock.png"
                alt=""
                className="w-3 h-3 sm:w-4 sm:h-4 mr-2"
              />
              <div>
                <h5 className="text-xs sm:text-md md:text-lg font-bold sm:font-semibold">
                {booking.work_type === 'Part Time1' || booking.work_type === 'Part Time2'
                      ?booking.work_type.slice(0, -1)
                      : booking.work_type}
                
                </h5>
                <h6 className="text-xs sm:text-md md:text-lg font-semibold">
                    {booking.work_type === 'Part Time1'
                      ? '8.00 AM - 12.00 PM'
                      : booking.work_type === 'Part Time2'
                      ? '1.00 PM - 5.00 PM'
                      : '8.00 AM - 5.00 PM'}
                  </h6>
              </div>
            </div>
            <div className="flex items-center">
              <img
                src="/icons/location.png"
                alt=""
                className="w-3 h-3 sm:w-4 sm:h-4 mr-2"
              />
             <div>
    <h5 className="text-[8px] sm:text-[12px] md:text-[15px] font-semibold">
      {booking.address.location.split(' ')[0]}
    </h5>
    <h6 className="text-[6px] sm:text-[10px] font-semibold">
      {booking.address.location.split(' ').slice(2).join(' ')}
    </h6>
  </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="sm:flex items-center mb-2">
              <img
                src="/ajmal.jpg"
                alt=""
                className="hidden sm:block w-5 h-5 sm:w-8 sm:h-8 rounded-full mr-2"
              />
              <h4 className="text-xs sm:text-md md:text-lg font-semibold">
                {booking.proId.name}
              </h4>
            </div>
            <div>
              <h5 className="text-xs sm:text-md md:text-lg font-semibold">
                {booking.category}
              </h5>
              {/* <h5 className="text-xs sm:text-md md:text-lg font-semibold">
                Professional ID: 123456
              </h5> */}
              <h5 className="text-xs sm:text-md md:text-lg font-semibold">
                charge:
              {booking.work_type === 'Part Time1' || booking.work_type === 'Part Time2'
                      ? booking.proId.charge.partime
                      : booking.proId.charge.fulltime}
              </h5>
            </div>
          </div>
          <div className="">
                <div className={`bg-gray-400 text-white py-1 px-1 sm:py-1 text-center  sm:px-3 rounded-md sm:rounded-lg text-[5px] sm:text-[10px] lg:text-[15px] mb-1 sm:mb-2 w-8 sm:w-16 lg:w-24`}>
                  {booking.work_status}
                </div>
                {booking.work_status === 'pending' && (
                  <div className="flex items-center">
                    <button
                      onClick={() => handleCancelClick(booking._id)}
                      className={`bg-orange-600 text-white py-1 px-1 text-center sm:py-1 sm:px-3 rounded-md sm:rounded-lg text-[5px] sm:text-[10px] lg:text-[15px] w-8 sm:w-16 lg:w-24`}
                    >
                      Cancel
                    </button>
                    {showConfirmation && bookingToCancel === booking._id && (
                      <div className=" bg-white border border-gray-300 p-3 rounded-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <p className='font-medium'>Are you sure ?</p>
                        <p className='text-[10px] sm:text-base text-blue-600'>₹100 will charge for cancellation</p>
                        <div className="flex justify-end mt-2">
                          <button onClick={handleCancelConfirm} className="bg-red-600 text-white px-2 py-1 rounded-md mr-2">
                            Confirm
                          </button>
                          <button onClick={handleCancelCancel} className="bg-gray-300 text-gray-800 px-2 py-1 rounded-md">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

          
        </div>
      ))
    ) : (
      <div className="flex justify-center">Not Found</div>
    )}
  </div>
  )
}

export default booking
