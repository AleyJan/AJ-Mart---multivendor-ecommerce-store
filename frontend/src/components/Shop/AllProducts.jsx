import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { toast } from "react-toastify";
import { getAllProductsShop, deleteProduct } from "../../redux/actions/product";
import { imageUrl } from "../../utils/imageUrl";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) dispatch(getAllProductsShop(seller._id));
  }, [dispatch, seller]);

  const handleDelete = async (id) => {
    await dispatch(deleteProduct(id));
    toast.success("Product deleted successfully!");
    dispatch(getAllProductsShop(seller._id));
  };

  return (
    <div className="w-full p-4 800px:p-8">
      <h3 className="text-[22px] font-Poppins pb-4 font-[500]">All Products</h3>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : products && products.length ? (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((item) => (
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
                <span className="text-[14px] text-gray-500">
                  Stock: {item.stock}
                </span>
              </div>
              <span className="text-[13px] text-[#68d284]">
                {item.sold_out} sold
              </span>

              <div className="flex items-center justify-end gap-4 pt-3">
                <Link to={`/dashboard-edit-product/${item._id}`}>
                  <AiOutlineEdit
                    size={22}
                    className="cursor-pointer text-[#3321c8]"
                    title="Edit"
                  />
                </Link>
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
          <p>You haven&apos;t added any products yet.</p>
          <Link to="/dashboard-create-product" className="text-[#3321c8] pt-2">
            Create your first product
          </Link>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
