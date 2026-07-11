const DashboardComingSoon = ({ title }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
      <h2 className="text-[24px] font-[600] mb-2">{title}</h2>
      <p className="text-gray-500 max-w-[420px]">
        This section will be built once the seller backend is connected.
      </p>
    </div>
  );
};

export default DashboardComingSoon;
