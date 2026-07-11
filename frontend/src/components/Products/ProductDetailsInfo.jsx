import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import Ratings from "./Ratings";
import { imageUrl } from "../../utils/imageUrl";

const ProductDetailsInfo = ({ data, totalProducts, totalReviews }) => {
  const [active, setActive] = useState(1);

  const joinedOn = data?.shop?.createdAt
    ? new Date(data.shop.createdAt).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded">
      {/* Tab headers */}
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className="text-[#000] text-[13px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? <div className={styles.active_indicator} /> : null}
        </div>
        <div className="relative">
          <h5
            className="text-[#000] text-[13px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 ? <div className={styles.active_indicator} /> : null}
        </div>
        <div className="relative">
          <h5
            className="text-[#000] text-[13px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 ? <div className={styles.active_indicator} /> : null}
        </div>
      </div>

      {/* Tab 1: Product details */}
      {active === 1 ? (
        <>
          <p className="py-2 text-[14px] 800px:text-[18px] leading-7 800px:leading-8 pb-10 whitespace-pre-line">
            {data.description}
          </p>
          <p className="py-2 text-[14px] 800px:text-[18px] leading-7 800px:leading-8 pb-10 whitespace-pre-line">
            {data.description}
          </p>
        </>
      ) : null}

      {/* Tab 2: Reviews */}
      {active === 2 ? (
        <div className="w-full min-h-[40vh] py-3">
          {data.reviews && data.reviews.length ? (
            data.reviews.map((review, index) => (
              <div className="w-full flex my-4" key={index}>
                <img
                  src={
                    review.user?.avatar?.url
                      ? imageUrl(review.user.avatar.url)
                      : "https://cdn.simpleicons.org/shopify"
                  }
                  alt=""
                  className="w-[45px] h-[45px] rounded-full object-cover"
                />
                <div className="pl-3">
                  <div className="w-full flex items-center">
                    <h4 className="font-[500] mr-3">
                      {review.user?.name || "User"}
                    </h4>
                    <Ratings rating={review.rating} />
                  </div>
                  <p className="text-gray-600 text-[14px] pt-1">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full flex items-center justify-center min-h-[30vh] text-gray-500">
              No reviews yet for this product.
            </div>
          )}
        </div>
      ) : null}

      {/* Tab 3: Seller information */}
      {active === 3 ? (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <div className="flex items-center">
              <img
                src={data.shop.shop_avatar.url}
                alt=""
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
              <div className="pl-3">
                <Link to={`/shop/preview/${encodeURIComponent(data.shop.name)}`}>
                  <h3 className={`${styles.shop_name} !pb-1 !pt-0 hover:underline`}>
                    {data.shop.name}
                  </h3>
                </Link>
                <h5 className="pb-2 text-[15px]">
                  ({data.shop.ratings}/5) Ratings
                </h5>
              </div>
            </div>
            <p className="pt-2 text-[14px] 800px:text-[16px] text-gray-600">
              This shop sells quality products with fast shipping and reliable
              support. Visit the shop to see their full catalogue.
            </p>
          </div>

          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600] text-[14px] 800px:text-[16px]">
                Joined on: <span className="font-[500]">{joinedOn}</span>
              </h5>
              <h5 className="font-[600] pt-3 text-[14px] 800px:text-[16px]">
                Total Products:{" "}
                <span className="font-[500]">{totalProducts ?? 0}</span>
              </h5>
              <h5 className="font-[600] pt-3 text-[14px] 800px:text-[16px]">
                Total Reviews:{" "}
                <span className="font-[500]">{totalReviews ?? 0}</span>
              </h5>
              <Link to={`/shop/preview/${encodeURIComponent(data.shop.name)}`}>
                <div className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}>
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsInfo;
