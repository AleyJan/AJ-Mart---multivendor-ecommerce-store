import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";

import styles from "../../styles/styles";
import { categoriesData } from "../../static/data";
import { useCatalogProducts } from "../../utils/catalog";
import { imageUrl } from "../../utils/imageUrl";
import DropDown from "../Route/DropDown";
import Navbar from "../Route/Navbar";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import RoleSwitchButton from "./RoleSwitchButton";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const allProducts = useCatalogProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false); // mobile hamburger drawer

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered =
      term &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filtered || null);
  };

  // Stick the navbar to the top after scrolling down (single listener)
  useEffect(() => {
    const handleScroll = () => setActive(window.scrollY > 70);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ---------------- TOP BAR ---------------- */}
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          {/* Logo */}
          <div>
            <Link to="/">
              <h1 className="text-[28px] font-extrabold text-[#f0a500]">
AJ MART
              </h1>
            </Link>
          </div>

          {/* Search box */}
          <div className="w-[50%] relative">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-2 border-[2px] border-[#3957db] rounded-md"
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-2 top-1.5 cursor-pointer"
            />
            {searchData && searchData.length !== 0 ? (
              <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm z-10 p-4 w-full">
                {searchData.map((item, index) => (
                  <Link to={`/product/${item.id}`} key={index}>
                    <div className="w-full flex items-center py-2">
                      <h1 className="text-[15px]">{item.name}</h1>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {/* Switch to the seller side (Fiverr-style) */}
          <RoleSwitchButton
            direction="toSeller"
            className="min-w-[210px] px-4 bg-black h-[50px] flex items-center justify-center rounded-[5px] cursor-pointer text-[#fff]"
          />
        </div>
      </div>

      {/* ---------------- NAV BAR ---------------- */}
      <div
        className={`${
          active ? "shadow-sm fixed top-0 left-0 z-10" : ""
        } transition hidden 800px:flex items-center justify-between w-full bg-[#3321c8] h-[70px]`}
      >
        <div
          className={`${styles.section} relative ${styles.normalFlex} justify-between`}
        >
          {/* All Categories dropdown */}
          <div onClick={() => setDropDown(!dropDown)}>
            <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
              <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
              <button className="h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md">
                All Categories
              </button>
              <IoIosArrowDown
                size={20}
                className="absolute right-2 top-4 cursor-pointer"
                onClick={() => setDropDown(!dropDown)}
              />
              {dropDown ? (
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              ) : null}
            </div>
          </div>

          {/* Nav links */}
          <div className={`${styles.normalFlex}`}>
            <Navbar active={activeHeading} />
          </div>

          {/* Right-side icons */}
          <div className="flex items-center">
            {/* Admin link */}
            {isAuthenticated && user?.role === "Admin" ? (
              <Link to="/admin/dashboard" className="mr-[15px]">
                <span className="text-white text-[13px] font-[600] bg-[#f0a500] px-3 h-[28px] rounded flex items-center">
                  Admin
                </span>
              </Link>
            ) : null}

            {/* Wishlist */}
            <div
              className="relative cursor-pointer mr-[15px]"
              onClick={() => setOpenWishlist(true)}
            >
              <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
              <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                {wishlist && wishlist.length}
              </span>
            </div>

            {/* Cart */}
            <div
              className="relative cursor-pointer mr-[15px]"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={30} color="rgb(255 255 255 / 83%)" />
              <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                {cart && cart.length}
              </span>
            </div>

            {/* Profile / avatar */}
            <div className="relative cursor-pointer mr-[15px]">
              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={imageUrl(user?.avatar?.url)}
                    className="w-[35px] h-[35px] rounded-full object-cover border-2 border-[#3bc177]"
                    alt=""
                  />
                </Link>
              ) : (
                <Link to="/login">
                  <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- MOBILE HEADER ---------------- */}
      <div
        className={`${
          active ? "shadow-sm fixed top-0 left-0 z-10" : ""
        } w-full h-[60px] bg-white z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between">
          <div>
            <BiMenuAltLeft
              size={40}
              className="ml-4 cursor-pointer"
              onClick={() => setOpen(true)}
            />
          </div>
          <div>
            <Link to="/">
              <h1 className="text-[24px] font-extrabold text-[#f0a500] mt-1">
AJ MART
              </h1>
            </Link>
          </div>
          <div
            className="relative mr-[20px] cursor-pointer"
            onClick={() => setOpenCart(true)}
          >
            <AiOutlineShoppingCart size={30} />
            <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
              {cart && cart.length}
            </span>
          </div>
        </div>

        {/* Sidebar drawer */}
        {open ? (
          <div className="fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0">
            <div className="fixed w-[72%] bg-white h-screen top-0 left-0 z-10 overflow-y-scroll">
              {/* Wishlist + close */}
              <div className="w-full justify-between flex pr-3">
                <div>
                  <div
                    className="relative mr-[15px] cursor-pointer"
                    onClick={() => {
                      setOpenWishlist(true);
                      setOpen(false);
                    }}
                  >
                    <AiOutlineHeart size={30} className="mt-5 ml-3" />
                    <span className="absolute right-0 top-3 rounded-full bg-[#3bc177] w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                      {wishlist && wishlist.length}
                    </span>
                  </div>
                </div>
                <RxCross1
                  size={30}
                  className="ml-4 mt-5 cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>

              {/* Search */}
              <div className="my-8 w-[92%] m-auto h-[40px] relative">
                <input
                  type="search"
                  placeholder="Search Product..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
                />
                {searchData && searchData.length !== 0 ? (
                  <div className="absolute bg-white z-10 shadow w-full left-0 p-3">
                    {searchData.map((item) => (
                      <Link
                        to={`/product/${item.id}`}
                        key={item.id}
                        onClick={() => setOpen(false)}
                      >
                        <div className="flex items-center py-3">
                          <h5 className="text-[15px]">{item.name}</h5>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Nav links */}
              <Navbar active={activeHeading} />

              {/* Switch to the seller side (Fiverr-style) */}
              <RoleSwitchButton
                direction="toSeller"
                onNavigate={() => setOpen(false)}
                className="ml-4 px-4 bg-black h-[45px] my-3 flex items-center justify-center rounded-[4px] cursor-pointer text-white"
              />

              <br />
              <br />

              {/* Auth */}
              <div className="flex w-full justify-center">
                {isAuthenticated ? (
                  <Link to="/profile" onClick={() => setOpen(false)}>
                    <img
                      src={imageUrl(user?.avatar?.url)}
                      alt=""
                      className="w-[60px] h-[60px] rounded-full border-[3px] border-[#0eae88] object-cover"
                    />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-[18px] pr-[10px] text-[#000000b7]"
                      onClick={() => setOpen(false)}
                    >
                      Login /
                    </Link>
                    <Link
                      to="/sign-up"
                      className="text-[18px] text-[#000000b7]"
                      onClick={() => setOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Cart drawer */}
      {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

      {/* Wishlist drawer */}
      {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null}
    </>
  );
};

export default Header;
