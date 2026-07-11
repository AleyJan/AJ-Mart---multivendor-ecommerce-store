import styles from "../../styles/styles";

const CheckoutSteps = ({ active }) => {
  const line = (lit) =>
    `w-[18px] 800px:w-[70px] h-[4px] ${lit ? "bg-[#f63b60]" : "bg-[#FDE1E6]"}`;
  const pill = (lit) =>
    `px-[10px] 800px:px-[20px] h-[34px] 800px:h-[38px] rounded-[20px] flex items-center justify-center cursor-pointer ${
      lit ? "bg-[#f63b60]" : "bg-[#FDE1E6]"
    }`;
  const pillText = (lit) =>
    `text-[12px] 800px:text-[16px] font-[600] whitespace-nowrap ${
      lit ? "text-white" : "text-[#f63b60]"
    }`;

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-[90%] 800px:w-[50%] flex items-center flex-wrap">
        {/* 1. Shipping */}
        <div className={`${styles.normalFlex}`}>
          <div className={pill(true)}>
            <span className={pillText(true)}>1.Shipping</span>
          </div>
          <div className={line(active > 1)} />
        </div>

        {/* 2. Payment */}
        <div className={`${styles.normalFlex}`}>
          <div className={pill(active > 1)}>
            <span className={pillText(active > 1)}>2.Payment</span>
          </div>
        </div>

        {/* 3. Success */}
        <div className={`${styles.normalFlex}`}>
          <div className={line(active > 2)} />
          <div className={pill(active > 2)}>
            <span className={pillText(active > 2)}>3.Success</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;
