import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import { createProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (success) {
      toast.success("Product created successfully!");
      dispatch({ type: "clearMessages" });
      navigate("/dashboard-products");
    }
  }, [dispatch, error, success, navigate]);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category) return toast.error("Please choose a category");
    if (images.length === 0)
      return toast.error("Please upload at least one image");

    const newForm = new FormData();
    images.forEach((image) => newForm.append("images", image));
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("tags", tags);
    newForm.append("originalPrice", originalPrice);
    newForm.append("discountPrice", discountPrice);
    newForm.append("stock", stock);
    newForm.append("shopId", seller._id);
    dispatch(createProduct(newForm));
  };

  const input =
    "mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  return (
    <div className="w-[90%] 800px:w-[70%] bg-white shadow rounded-[4px] p-3 my-6 mx-auto">
      <h5 className="text-[24px] font-Poppins text-center">Create Product</h5>
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            className={input}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your product name..."
            required
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows="6"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your product description..."
            required
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Choose a category</option>
            {categoriesData.map((c) => (
              <option value={c.title} key={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">Tags</label>
          <input
            type="text"
            value={tags}
            className={input}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter your product tags..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Original Price</label>
          <input
            type="number"
            value={originalPrice}
            className={input}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter your product price..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Price (With Discount) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={discountPrice}
            className={input}
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="Enter your product price with discount..."
            required
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={stock}
            className={input}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter your product stock..."
            required
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3 cursor-pointer" color="#555" />
            </label>
            {images.map((image, index) => (
              <img
                src={URL.createObjectURL(image)}
                key={index}
                alt=""
                className="h-[120px] w-[120px] object-cover m-2"
              />
            ))}
          </div>
          <br />
          <div>
            <input
              type="submit"
              value="Create"
              className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] text-white bg-[#3321c8] hover:bg-blue-700 sm:text-sm"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
