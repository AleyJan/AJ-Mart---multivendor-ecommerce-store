import styles from "../../../styles/styles";

const sponsors = [
  // { id: 1, name: "Sony", url: "https://cdn.simpleicons.org/sony" },
  { id: 1, name: "Dell", url: "https://cdn.simpleicons.org/dell" },
  { id: 2, name: "LG", url: "https://cdn.simpleicons.org/lg" },
  { id: 3, name: "Apple", url: "https://cdn.simpleicons.org/apple" },
  { id: 4, name: "Google", url: "https://cdn.simpleicons.org/google" },
  { id: 5, name: "Samsung", url: "https://cdn.simpleicons.org/samsung" },
];

const Sponsored = () => {
  return (
    <div
      className={`${styles.section} hidden sm:flex items-center justify-between w-full bg-white py-10 px-5 mb-12 cursor-pointer rounded-lg shadow-sm`}
    >
      {sponsors.map((sponsor) => (
        <div className="flex items-start" key={sponsor.id}>
          <img
            src={sponsor.url}
            alt={sponsor.name}
            title={sponsor.name}
            className="w-[120px] h-[50px] object-contain"
          />
        </div>
      ))}
    </div>
  );
};

export default Sponsored;
