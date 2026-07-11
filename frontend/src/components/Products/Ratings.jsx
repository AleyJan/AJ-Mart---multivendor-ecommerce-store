import { AiFillStar, AiOutlineStar } from "react-icons/ai";

// Renders 5 stars, filled up to the (rounded) rating.
const Ratings = ({ rating = 0 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      i <= Math.round(rating) ? (
        <AiFillStar key={i} size={20} className="text-[#f6b100] mr-1" />
      ) : (
        <AiOutlineStar key={i} size={20} className="text-[#f6b100] mr-1" />
      )
    );
  }
  return <div className="flex">{stars}</div>;
};

export default Ratings;
