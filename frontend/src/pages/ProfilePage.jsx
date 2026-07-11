import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../components/Layout/Header";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import ProfileContent from "../components/Profile/ProfileContent";
import styles from "../styles/styles";

const ProfilePage = () => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [active, setActive] = useState(1);

  // Only logged-in users can view the profile page
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  return (
    <div>
      <Header />
      <div className={`${styles.section} flex bg-[#f5f5f5] py-10`}>
        <div className="w-[50px] 800px:w-[335px] sticky 800px:mt-0 mt-[18%] mr-4">
          <ProfileSidebar active={active} setActive={setActive} />
        </div>
        <ProfileContent active={active} />
      </div>
    </div>
  );
};

export default ProfilePage;
