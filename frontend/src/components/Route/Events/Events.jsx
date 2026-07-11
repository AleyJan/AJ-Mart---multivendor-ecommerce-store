import styles from "../../../styles/styles";
import EventCard from "../../Events/EventCard";
import { useCatalogEvents } from "../../../utils/catalog";

// Percentage discount for an event (0 when there's no original price).
const discountPercent = (e) =>
  e.originalPrice ? (e.originalPrice - e.discountPrice) / e.originalPrice : 0;

const Events = () => {
  const allEvents = useCatalogEvents();
  // From all shop-listed events, feature the one with the biggest discount.
  const topEvent = allEvents.length
    ? [...allEvents].sort((a, b) => discountPercent(b) - discountPercent(a))[0]
    : null;

  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>Popular Events</h1>
      </div>
      <div className="w-full grid">
        {topEvent ? (
          <EventCard data={topEvent} />
        ) : (
          <h4 className="text-center">No Events to show right now!</h4>
        )}
      </div>
    </div>
  );
};

export default Events;
