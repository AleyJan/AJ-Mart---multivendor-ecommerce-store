import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { toast } from "react-toastify";
import { createProduct, updateProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { server } from "../../server";
import { imageUrl } from "../../utils/imageUrl";

const CreateProduct = () => {
  const { id } = useParams(); // present => edit mode
  const isEdit = Boolean(id);

  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [images, setImages] = useState([]); // newly picked File objects
  const [existingImages, setExistingImages] = useState([]); // already-saved {url}
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(isEdit);

  // Load the existing product when editing
  useEffect(() => {
    if (!isEdit) return;
    axios
      .get(`${server}/product/get-product/${id}`)
      .then(({ data }) => {
        const p = data.product;
        setName(p.name || "");
        setDescription(p.description || "");
        setCategory(p.category || "");
        setTags(p.tags || "");
        // Map stored data into the form's fields: "Price" is the regular price,
        // "Discounted Price" is optional. Products with no discount keep their
        // selling price in discountPrice, so surface that as the regular Price.
        if (p.originalPrice == null || p.originalPrice === "") {
          setOriginalPrice(p.discountPrice ?? "");
          setDiscountPrice("");
        } else {
          setOriginalPrice(p.originalPrice);
          setDiscountPrice(p.discountPrice ?? "");
        }
        setStock(p.stock ?? "");
        setExistingImages(p.images || []);
      })
      .catch((e) =>
        toast.error(e.response?.data?.message || "Could not load product")
      )
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (success) {
      toast.success(
        isEdit ? "Product updated successfully!" : "Product created successfully!"
      );
      dispatch({ type: "clearMessages" });
      navigate("/dashboard-products");
    }
  }, [dispatch, error, success, navigate, isEdit]);

  // Accumulate picks instead of replacing, so multiple rounds of selection add up
  const handleImageChange = (e) => {
    const picked = Array.from(e.target.files);
    setImages((prev) => [...prev, ...picked]);
    e.target.value = ""; // allow re-picking the same file
  };

  const removeNewImage = (index) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category) return toast.error("Please choose a category");
    if (!isEdit && images.length === 0)
      return toast.error("Please upload at least one image");

    const newForm = new FormData();
    images.forEach((image) => newForm.append("images", image));
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("tags", tags);
    // discountPrice is the effective selling price used everywhere; originalPrice
    // is only the strikethrough shown when a real discount exists.
    const hasDiscount = discountPrice !== "" && discountPrice != null;
    newForm.append("discountPrice", hasDiscount ? discountPrice : originalPrice);
    newForm.append("originalPrice", hasDiscount ? originalPrice : "");
    newForm.append("stock", stock);
    newForm.append("shopId", seller._id);

    if (isEdit) {
      dispatch(updateProduct(id, newForm));
    } else {
      dispatch(createProduct(newForm));
    }
  };

  const input =
    "mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  if (loading) {
    return (
      <div className="w-[90%] 800px:w-[70%] bg-white shadow rounded-[4px] p-6 my-6 mx-auto text-center text-gray-500">
        Loading product...
      </div>
    );
  }

  return (
    <div className="w-[90%] 800px:w-[70%] bg-white shadow rounded-[4px] p-3 my-6 mx-auto">
      <h5 className="text-[24px] font-Poppins text-center">
        {isEdit ? "Edit Product" : "Create Product"}
      </h5>
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
          <label className="pb-2">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={originalPrice}
            className={input}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter your product price..."
            required
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Discounted Price{" "}
            <span className="text-[12px] text-gray-400">(optional)</span>
          </label>
          <input
            type="number"
            value={discountPrice}
            className={input}
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="Enter discounted price (leave blank if none)..."
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
            Upload Images{" "}
            {isEdit ? (
              <span className="text-[12px] text-gray-400">
                (upload new images to replace the current ones)
              </span>
            ) : (
              <span className="text-red-500">*</span>
            )}
          </label>
          <input
            type="file"
            id="upload"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />

          {/* existing (saved) images shown in edit mode until replaced */}
          {isEdit && existingImages.length > 0 && images.length === 0 ? (
            <div className="w-full flex items-center flex-wrap">
              {existingImages.map((img, index) => (
                <img
                  src={imageUrl(img.url)}
                  key={index}
                  alt=""
                  className="h-[120px] w-[120px] object-contain m-2 border rounded"
                />
              ))}
            </div>
          ) : null}

          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle
                size={30}
                className="mt-3 cursor-pointer"
                color="#555"
              />
            </label>
            {images.map((image, index) => (
              <div key={index} className="relative m-2">
                <img
                  src={URL.createObjectURL(image)}
                  alt=""
                  className="h-[120px] w-[120px] object-contain border rounded"
                />
                <RxCross1
                  className="absolute top-1 right-1 bg-white rounded-full p-[2px] cursor-pointer shadow"
                  size={18}
                  onClick={() => removeNewImage(index)}
                  title="Remove"
                />
              </div>
            ))}
          </div>
          <br />
          <div>
            <input
              type="submit"
              value={isEdit ? "Update" : "Create"}
              className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] text-white bg-[#3321c8] hover:bg-blue-700 sm:text-sm"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
