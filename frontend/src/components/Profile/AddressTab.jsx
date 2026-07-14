import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { loadUser } from "../../redux/actions/user";
import styles from "../../styles/styles";

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Pakistan",
  "India",
  "Germany",
  "France",
];
const addressTypes = ["Default", "Home", "Office"];

const AddressTab = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [addressType, setAddressType] = useState("");

  const reset = () => {
    setCountry("");
    setCity("");
    setAddress1("");
    setAddress2("");
    setZipCode("");
    setAddressType("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!country || !city || !address1 || !zipCode || !addressType) {
      return toast.error("Please fill all the required fields");
    }
    try {
      await axios.put(
        `${server}/user/update-user-addresses`,
        { country, city, address1, address2, zipCode, addressType },
        { withCredentials: true }
      );
      toast.success("Address saved!");
      dispatch(loadUser());
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save address");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${server}/user/delete-user-address/${id}`, {
        withCredentials: true,
      });
      toast.success("Address removed");
      dispatch(loadUser());
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete address");
    }
  };

  const addresses = user?.addresses || [];

  return (
    <div className="w-full px-2 800px:px-5">
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-[22px] font-[500]">My Addresses</h3>
        <button
          className={`${styles.button} !h-[40px] !rounded-[4px] text-white`}
          onClick={() => setOpen(true)}
        >
          Add New
        </button>
      </div>

      {addresses.length ? (
        addresses.map((a) => (
          <div
            key={a._id}
            className="w-full bg-white rounded shadow-sm flex items-center justify-between p-4 mb-3"
          >
            <div className="flex items-center gap-4">
              <span className="text-[15px] font-[600] min-w-[70px]">
                {a.addressType}
              </span>
              <span className="text-[14px] text-gray-600">
                {a.address1}
                {a.address2 ? `, ${a.address2}` : ""}, {a.city}, {a.country} -{" "}
                {a.zipCode}
              </span>
            </div>
            <AiOutlineDelete
              size={22}
              className="cursor-pointer text-red-600"
              title="Delete"
              onClick={() => handleDelete(a._id)}
            />
          </div>
        ))
      ) : (
        <div className="w-full flex items-center justify-center min-h-[25vh] text-gray-500">
          You have no saved addresses.
        </div>
      )}

      {/* Add-address modal */}
      {open ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#0000005f] z-50 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[50%] bg-white rounded shadow p-5 relative max-h-[90vh] overflow-y-auto">
            <RxCross1
              size={26}
              className="absolute top-3 right-3 cursor-pointer"
              onClick={() => setOpen(false)}
            />
            <h4 className="text-[20px] font-[500] text-center pb-4">
              Add New Address
            </h4>
            <form onSubmit={handleSubmit}>
              <div className="pb-3">
                <label className="block pb-1">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full border h-[40px] rounded-[5px]"
                >
                  <option value="">Choose your country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pb-3">
                <label className="block pb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className="pb-3">
                <label className="block pb-1">Address 1</label>
                <input
                  type="text"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className="pb-3">
                <label className="block pb-1">Address 2</label>
                <input
                  type="text"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className="pb-3">
                <label className="block pb-1">Zip Code</label>
                <input
                  type="number"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className="pb-3">
                <label className="block pb-1">Address Type</label>
                <select
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="w-full border h-[40px] rounded-[5px]"
                >
                  <option value="">Choose type</option>
                  {addressTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="submit"
                value="Save Address"
                className={`${styles.button} w-full text-white !rounded-[4px] mt-2 cursor-pointer`}
              />
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AddressTab;
