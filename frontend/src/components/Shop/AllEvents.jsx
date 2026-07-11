import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { getAllEventsShop, deleteEvent } from "../../redux/actions/event";
import { imageUrl } from "../../utils/imageUrl";

const AllEvents = () => {
  const { events, isLoading } = useSelector((state) => state.events);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) dispatch(getAllEventsShop(seller._id));
  }, [dispatch, seller]);

  const handleDelete = async (id) => {
    await dispatch(deleteEvent(id));
    toast.success("Event deleted successfully!");
    dispatch(getAllEventsShop(seller._id));
  };

  return (
    <div className="w-full p-4 800px:p-8">
      <h3 className="text-[22px] font-Poppins pb-4 font-[500]">All Events</h3>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : events && events.length ? (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-sm p-3 relative"
            >
              <img
                src={imageUrl(item.images?.[0]?.url)}
                alt=""
                className="w-full h-[150px] object-contain"
              />
              <h4 className="pt-2 font-[500] text-[#333] truncate">
                {item.name}
              </h4>
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-[16px]">
                  {item.discountPrice}$
                </span>
                <span className="text-[13px] text-[#475ad2]">{item.status}</span>
              </div>
              <span className="text-[12px] text-gray-500">
                Ends: {new Date(item.Finish_Date).toLocaleDateString()}
              </span>

              <div className="flex items-center justify-end gap-4 pt-3">
                <AiOutlineDelete
                  size={22}
                  className="cursor-pointer text-red-600"
                  title="Delete"
                  onClick={() => handleDelete(item._id)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center min-h-[40vh] text-gray-500">
          <p>You haven&apos;t created any events yet.</p>
          <Link to="/dashboard-create-event" className="text-[#3321c8] pt-2">
            Create your first event
          </Link>
        </div>
      )}
    </div>
  );
};

export default AllEvents;
