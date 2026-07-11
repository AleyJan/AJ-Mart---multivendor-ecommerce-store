import { useState } from "react";
import ProductCard from "../Route/ProductCard/ProductCard";
import EventCard from "../Events/EventCard";
import Ratings from "../Products/Ratings";
import { productData, eventData } from "../../static/data";
import { imageUrl } from "../../utils/imageUrl";

const ShopProfileData = ({ shopName, products: productsProp, events: eventsProp }) => {
  const [active, setActive] = useState(1);

  const products =
    productsProp || productData.filter((p) => p.shop.name === shopName);
  const events =
    eventsProp || eventData.filter((e) => e.shop.name === shopName);

  // all reviews across this shop's products
  const allReviews = products.flatMap((p) => p.reviews || []);

  const tabClass = (id) =>
    `font-[600] text-[16px] 800px:text-[20px] cursor-pointer pr-5 ${
      active === id ? "text-red-500" : "text-[#333]"
    }`;

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex w-full items-center border-b pb-2 overflow-x-auto">
        <h5 className={tabClass(1)} onClick={() => setActive(1)}>
          Shop Products
        </h5>
        <h5 className={tabClass(2)} onClick={() => setActive(2)}>
          Running Events
        </h5>
        <h5 className={tabClass(3)} onClick={() => setActive(3)}>
          Shop Reviews
        </h5>
      </div>

      <br />

      {/* Shop Products */}
      {active === 1 ? (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12">
          {products.map((item) => (
            <ProductCard data={item} key={item.id} />
          ))}
        </div>
      ) : null}
      {active === 1 && products.length === 0 ? (
        <h5 className="w-full text-center py-5 text-[18px] text-gray-500">
          No products for this shop yet!
        </h5>
      ) : null}

      {/* Running Events */}
      {active === 2 ? (
        <div className="w-full">
          {events.map((item) => (
            <EventCard data={item} key={item.id} />
          ))}
          {events.length === 0 ? (
            <h5 className="w-full text-center py-5 text-[18px] text-gray-500">
              No running events for this shop!
            </h5>
          ) : null}
        </div>
      ) : null}

      {/* Shop Reviews */}
      {active === 3 ? (
        <div className="w-full">
          {allReviews.length ? (
            allReviews.map((review, index) => (
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
                  <div className="flex items-center">
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
              This shop has no reviews yet.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ShopProfileData;
