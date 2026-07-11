import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { getAllProductsShop } from "../../redux/actions/product";
import { getAllEventsShop } from "../../redux/actions/event";
import { getAllOrdersOfShop } from "../../redux/actions/order";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const { orders } = useSelector((state) => state.order);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllProductsShop(seller._id));
      dispatch(getAllEventsShop(seller._id));
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller]);

  const availableBalance = (seller?.availableBalance || 0).toFixed(2);
  const productCount = products?.length || 0;
  const eventCount = events?.length || 0;
  const orderCount = orders?.length || 0;

  return (
    <div className="w-full p-4 800px:p-8">
      <h3 className="text-[22px] font-Poppins pb-2 font-[500]">Overview</h3>
      <div className="w-full block 800px:flex items-center justify-between">
        {/* Account balance */}
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2" fill="#00000085" />
            <h3 className="text-[18px] leading-5 font-[400] text-[#00000085]">
              Account Balance{" "}
              <span className="text-[16px]">(with 10% service charge)</span>
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
            ${availableBalance}
          </h5>
          <Link to="/dashboard-withdraw-money">
            <h5 className="pt-4 pl-[2] text-[#077f9c]">Withdraw Money</h5>
          </Link>
        </div>

        {/* All orders */}
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-2" fill="#00000085" />
            <h3 className="text-[18px] leading-5 font-[400] text-[#00000085]">
              All Orders
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{orderCount}</h5>
          <Link to="/dashboard-orders">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
          </Link>
        </div>

        {/* All products */}
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2" fill="#00000085" />
            <h3 className="text-[18px] leading-5 font-[400] text-[#00000085]">
              All Products
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{productCount}</h5>
          <Link to="/dashboard-products">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Products</h5>
          </Link>
        </div>
      </div>

      <h3 className="text-[22px] font-Poppins pb-2 mt-8 font-[500]">
        Latest Orders
      </h3>
      <div className="w-full min-h-[30vh] bg-white rounded flex items-center justify-center text-gray-400">
        Orders will appear here once buyers start ordering from your shop.
      </div>

      <p className="text-[13px] text-gray-400 mt-4">
        You have {eventCount} running event(s).
      </p>
    </div>
  );
};

export default DashboardHero;
