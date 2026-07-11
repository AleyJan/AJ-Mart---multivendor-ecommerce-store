import { Link } from "react-router-dom";
import { navItems } from "../../static/data";

const Navbar = ({ active }) => {
  return (
    <div className="block 800px:flex items-center">
      {navItems.map((item, index) => (
        <div className="flex" key={index}>
          <Link
            to={item.url}
            className={`${
              active === index + 1
                ? "text-[#17dd1f]"
                : "text-black 800px:text-white"
            } pb-[30px] 800px:pb-0 font-[500] px-6 cursor-pointer`}
          >
            {item.title}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Navbar;
