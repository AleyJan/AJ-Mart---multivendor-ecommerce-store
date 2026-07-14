import { useEffect } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import EventCard from "../components/Events/EventCard";
import styles from "../styles/styles";
import { useCatalogEvents } from "../utils/catalog";

const EventsPage = () => {
  const eventData = useCatalogEvents();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <Header activeHeading={4} />
      <div className="w-full bg-[#f5f5f5] min-h-screen">
        <div className={`${styles.section} py-10`}>
          <h2 className="text-[25px] font-[600] mb-6">Popular Events</h2>
          {eventData.length !== 0 ? (
            eventData.map((item) => <EventCard key={item.id} data={item} />)
          ) : (
            <h4 className="text-center">No Events to show right now!</h4>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventsPage;
