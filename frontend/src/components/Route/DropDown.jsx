import { useNavigate } from "react-router-dom";

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();

  const submitHandle = (category) => {
    // Products listing is built in a later step; for now just close the menu.
    navigate(`/products?category=${encodeURIComponent(category.title)}`);
    setDropDown(false);
    window.location.reload();
  };

  return (
    <div className="pb-4 w-[270px] bg-[#fff] absolute z-30 rounded-b-md shadow-sm">
      {categoriesData &&
        categoriesData.map((category, index) => (
          <div
            key={index}
            className="flex items-center px-5 py-2 cursor-pointer select-none hover:bg-gray-50"
            onClick={() => submitHandle(category)}
          >
            <h3 className="m-0 text-[16px]">{category.title}</h3>
          </div>
        ))}
    </div>
  );
};

export default DropDown;
