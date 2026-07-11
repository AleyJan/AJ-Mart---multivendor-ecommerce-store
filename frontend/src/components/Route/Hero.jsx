import { Link } from "react-router-dom";
import styles from "../../styles/styles";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat bg-cover bg-center ${styles.normalFlex}`}
      style={{
        backgroundImage:
          "url(https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg)",
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
        <h1 className="text-[28px] leading-[1.2] 800px:text-[44px] 1000px:text-[60px] text-[#3d3a3a] font-[600] capitalize">
          The Ultimate Convenience
        </h1>
        <p className="pt-4 text-[14px] 800px:text-[16px] font-[Poppins] font-[400] text-[#000000ba]">
          From everyday essentials to extraordinary finds, get everything you
          need delivered right to your door. Shop our massive catalog of
          millions of items at unbeatable prices.
        </p>
        <Link to="/products" className="inline-block">
          <div className="mt-5 bg-black px-5 py-2 800px:px-6 800px:py-3 rounded-md">
            <span className="text-[#fff] font-[Poppins] text-[16px] 800px:text-[18px]">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
