import { useEffect, useState } from "react";

const CountDown = ({ data }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(data.Finish_Date) - +new Date();
    if (difference <= 0) return {};
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const units = Object.keys(timeLeft);

  return (
    <div>
      {units.length ? (
        units.map((unit, index) => (
          <span key={index} className="text-[16px] 800px:text-[20px] text-[#475ad2] mr-2">
            {timeLeft[unit]} {unit}
          </span>
        ))
      ) : (
        <span className="text-[20px] text-[red]">Time's Up</span>
      )}
    </div>
  );
};

export default CountDown;
