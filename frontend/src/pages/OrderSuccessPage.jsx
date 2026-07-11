import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const confettiColors = [
  "#6c5ce7",
  "#f63b60",
  "#fdcb6e",
  "#00b894",
  "#0984e3",
  "#e17055",
];

const Success = () => {
  // generate a handful of confetti pieces with varied positions/timing
  const pieces = Array.from({ length: 24 }).map((_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2.5 + Math.random() * 2,
    color: confettiColors[i % confettiColors.length],
    rotate: Math.random() * 360,
  }));

  return (
    <div className="relative w-full min-h-[60vh] bg-[#f5f5f5] overflow-hidden flex flex-col items-center justify-center">
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-40px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(420px) rotate(720deg); opacity: 0; }
        }
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: `${p.left}%`,
            width: "10px",
            height: "10px",
            background: p.color,
            borderRadius: "2px",
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}

      <div
        className="w-[70px] h-[70px] rounded-full bg-[#00b894] flex items-center justify-center mb-5 z-10"
        style={{ animation: "pop-in 0.5s ease-out" }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h5 className="text-center text-[25px] text-[#000000a1] z-10">
        Your order is successful 😍
      </h5>
    </div>
  );
};

const OrderSuccessPage = () => {
  return (
    <div>
      <Header />
      <Success />
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
