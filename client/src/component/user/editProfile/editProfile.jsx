import React, { useState,useEffect } from "react";
import userAxios from '../../../Axios/userAxios'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


function EditProfile({closePopup,userData,updateUserData}) {
  const [phone, setPhone] = useState(userData.phone);
  const [name, setName] = useState(userData.name);
  const [photo, setPhoto] = useState(userData.image);
  const [errMsg, setErrMsg] = useState("");
  const token = useSelector((state) => state.user.Token);
  const userId = useSelector((state) => state.user.Id);
  const navigate = useNavigate();


  if (!token) {
      navigate("/");
  }
  const changeimg = (img) => {
    const file = img.target.files[0];
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    setErrMsg("");

    if (!allowedExtensions.test(file.name)) {
      setErrMsg("Only JPEG, JPG, and PNG images are supported.");
      return;
    }
    let reader = new FileReader();
    reader.readAsDataURL(img.target.files[0]);
    reader.onload = () => {
      setPhoto(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };
  useEffect(() => {
  
  }, [phone,name,photo])
  

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (name === userData.name && phone === userData.phone && photo === userData.image) {
      // No changes made, display an error message
      setErrMsg("No changes were made.");
      return;
    }
    if (!name || name.trim().length < 3) {
      setErrMsg("Enter Valid Name.");
      return;
    }
    if (!phone || !/^\d{10}$/.test(phone.toString().trim())) {
      setErrMsg("Phone must be a 10-digit number.");
      return;
    }
    userAxios.post(
      '/userEdit',
      {name,phone,photo,userId},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => {
      if (res.data.status === "success") {
        closePopup(false)
        updateUserData({
          ...userData,
          name,
          phone,
          image: photo,
        });
          Toast.fire({
              icon: "success",
              title: "Profile updated",
          }).then(() => {
              navigate("/profile");
          });
      } else {
        closePopup(false)
          Toast.fire({
              icon: "error",
              title: "Somthing went wrong",
          }).then(() => {
              navigate("/profile");
          });
      }
  });

  };
  const handleCancelButton = () => {
    closePopup(false);
  };
  const Toast = Swal.mixin({
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

  return (
    <div className="absolute  min-h-screen w-fit flex justify-center items-start">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
      <label htmlFor="file" className="flex flex-col items-center cursor-pointer mb-4">
  <img
    src={photo ? photo : "/icons/man.png"}
    alt="...."
    className="avatar rounded-full w-20 h-20 mb-2"
  />
  <span className="text-blue-500">Choose Image</span>
</label>
<div className="mb-4">
  <input
    type="file"
    name="photo"
    accept=".jpg,.jpeg,.png"
    id="file"
    onChange={changeimg}
    className="hidden"
  />
</div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-left font-medium mb-1">
            Your Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Your Name"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-left font-medium mb-1">
            Your Dial Number
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            placeholder="Your Dial number"
            className="w-full p-2 border rounded"
          />
        </div>
        {errMsg && <div className="text-red-500 mb-4">{errMsg}</div>}
        <div className="flex justify-end">
        <button
            className="bg-gray-300 hover:bg-gray-500 text-white py-1 px-2 rounded me-2"
            onClick={handleCancelButton}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
            onClick={handleUpdateProfile}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
