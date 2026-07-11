import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineCamera } from "react-icons/ai";
import { server, backend_url } from "../../server";

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);

  const [name, setName] = useState(seller?.name || "");
  const [description, setDescription] = useState(seller?.description || "");
  const [address, setAddress] = useState(seller?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(seller?.phoneNumber || "");
  const [zipCode, setZipcode] = useState(seller?.zipCode || "");

  const avatarUrl = seller?.avatar?.url
    ? `${backend_url}${seller.avatar.url}`
    : "https://cdn.simpleicons.org/shopify";

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    await axios
      .put(`${server}/shop/update-shop-avatar`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        toast.success("Shop avatar updated!");
        window.location.reload();
      })
      .catch((err) =>
        toast.error(err.response?.data?.message || "Avatar update failed")
      );
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    await axios
      .put(
        `${server}/shop/update-seller-info`,
        { name, address, zipCode, phoneNumber, description },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("Shop info updated successfully!");
        window.location.reload();
      })
      .catch((err) =>
        toast.error(err.response?.data?.message || "Update failed")
      );
  };

  const input =
    "mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <div className="flex w-full 800px:w-[80%] flex-col justify-center my-5">
        {/* Avatar */}
        <div className="w-full flex items-center justify-center">
          <div className="relative">
            <img
              src={avatarUrl}
              alt=""
              className="w-[200px] h-[200px] rounded-full object-cover border-[3px] border-[#3ad132]"
            />
            <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
              <input
                type="file"
                id="image"
                className="hidden"
                onChange={handleImage}
              />
              <label htmlFor="image">
                <AiOutlineCamera />
              </label>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          className="flex flex-col items-center px-3 mt-6"
          onSubmit={updateHandler}
        >
          <div className="w-full 800px:w-[50%] mt-5">
            <label className="block pb-2">Shop Name</label>
            <input
              type="text"
              className={input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="w-full 800px:w-[50%] mt-5">
            <label className="block pb-2">Shop Description</label>
            <input
              type="text"
              className={input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your shop description"
            />
          </div>
          <div className="w-full 800px:w-[50%] mt-5">
            <label className="block pb-2">Shop Address</label>
            <input
              type="text"
              className={input}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="w-full 800px:w-[50%] mt-5">
            <label className="block pb-2">Shop Phone Number</label>
            <input
              type="number"
              className={input}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="w-full 800px:w-[50%] mt-5">
            <label className="block pb-2">Shop Zip Code</label>
            <input
              type="number"
              className={input}
              value={zipCode}
              onChange={(e) => setZipcode(e.target.value)}
              required
            />
          </div>
          <div className="w-full 800px:w-[50%] mt-5">
            <input
              type="submit"
              value="Update Shop"
              className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] text-white bg-[#3321c8] hover:bg-blue-700 sm:text-sm"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
