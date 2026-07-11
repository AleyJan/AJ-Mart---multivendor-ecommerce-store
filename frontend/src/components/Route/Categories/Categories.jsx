import { useNavigate } from "react-router-dom";
import { FaShippingFast, FaGift, FaTrophy, FaShieldAlt } from "react-icons/fa";
import styles from "../../../styles/styles";
import { categoriesData } from "../../../static/data";

const brandingData = [
  {
    id: 1,
    title: "Free Shipping",
    Description: "From all orders over 100$",
    Icon: FaShippingFast,
  },
  {
    id: 2,
    title: "Daily Surprise Offers",
    Description: "Save up to 25% off",
    Icon: FaGift,
  },
  {
    id: 3,
    title: "Affordable Prices",
    Description: "Get Factory direct price",
    Icon: FaTrophy,
  },
  {
    id: 4,
    title: "Secure Payments",
    Description: "100% protected payments",
    Icon: FaShieldAlt,
  },
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* ---------------- Branding strip ---------------- */}
      <div className={`${styles.section} hidden 800px:block`}>
        <div className="branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md">
          {brandingData.map(({ id, title, Description, Icon }) => (
            <div className="flex items-start" key={id}>
              <Icon size={32} className="text-[#f0a500] mr-3 mt-1" />
              <div>
                <h3 className="font-bold text-sm md:text-base">{title}</h3>
                <p className="text-xs md:text-sm text-gray-500">{Description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- Categories grid ---------------- */}
      <div className={`${styles.section} bg-white p-6 rounded-lg mb-12`} id="categories">
        <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]">
          {categoriesData.map((category) => {
            const handleSubmit = () => {
              navigate(`/products?category=${encodeURIComponent(category.title)}`);
            };
            return (
              <div
                className="w-full h-[90px] 800px:h-[100px] flex items-center justify-between cursor-pointer overflow-hidden"
                key={category.id}
                onClick={handleSubmit}
              >
                <h5 className="text-[15px] 800px:text-[18px] leading-[1.3]">
                  {category.title}
                </h5>
                <img
                  src={category.image_Url}
                  className="w-[80px] h-[60px] 800px:w-[100px] 800px:h-[80px] object-cover rounded"
                  alt={category.title}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Categories;
