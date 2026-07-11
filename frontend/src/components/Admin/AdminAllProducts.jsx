import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";

const AdminAllProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${server}/product/admin-all-products`, { withCredentials: true })
      .then((r) => setProducts(r.data.products || []))
      .catch(() => {});
  }, []);

  return (
    <div className="w-full p-4 800px:p-8">
      <h3 className="text-[22px] font-Poppins pb-4 font-[500]">All Products</h3>
      <div className="overflow-x-auto bg-white rounded shadow-sm p-3">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b text-[14px] text-gray-500">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Shop</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Stock</th>
              <th className="py-2 pr-4">Sold</th>
              <th className="py-2 pr-4">View</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b text-[14px]">
                <td className="py-3 pr-4">{p.name?.slice(0, 30)}</td>
                <td className="py-3 pr-4">{p.shop?.name}</td>
                <td className="py-3 pr-4">US${p.discountPrice}</td>
                <td className="py-3 pr-4">{p.stock}</td>
                <td className="py-3 pr-4">{p.sold_out || 0}</td>
                <td className="py-3 pr-4">
                  <Link
                    to={`/product/${p._id}`}
                    className="text-[#3321c8] underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAllProducts;
