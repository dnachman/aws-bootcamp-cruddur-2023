import "./UserFeedPage.css";
import React from "react";
import { useParams } from "react-router-dom";

import DesktopNavigation from "../components/DesktopNavigation";
import DesktopSidebar from "../components/DesktopSidebar";
import ActivityFeed from "../components/ActivityFeed";
import ActivityForm from "../components/ActivityForm";
import ProfileHeading from "../components/ProfileHeading";
import ProfileForm from "../components/ProfileForm";

import { checkAuth, getAccessToken } from "../lib/CheckAuth";

export default function UserFeedPage() {
  const [activities, setActivities] = React.useState([]);
  const [profile, setProfile] = React.useState([]);
  const [popped, setPopped] = React.useState([]);
  const [poppedProfile, setPoppedProfile] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const dataFetchedRef = React.useRef(false);

  const params = useParams();

  const loadData = async () => {
    try {
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/activities/@${params.handle}`;
      await getAccessToken();
      const access_token = localStorage.getItem("access_token");
      const res = await fetch(backend_url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        method: "GET",
      });
      let resJson = await res.json();
      console.log("resJson", resJson);
      if (res.status === 200) {
        console.log("setProfile", resJson.profile);
        console.log("setActivities", resJson.activities);
        setActivities(resJson.activities);
        setProfile(resJson.profile);
      } else {
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    checkAuth(setUser);
  }, []);

  React.useEffect(() => {
    //prevents double call
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    // checkAuth(setUser);

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <article>
      <DesktopNavigation user={user} active={"profile"} setPopped={setPopped} />
      <div className="content">
        <ActivityForm popped={popped} setActivities={setActivities} />
        <ProfileForm
          profile={profile}
          user={user}
          popped={poppedProfile}
          setPopped={setPoppedProfile}
        />
        <div className="activity_feed">
          <ProfileHeading
            setPopped={setPoppedProfile}
            profile={profile}
            user={user}
          />
          <ActivityFeed activities={activities} />
        </div>
      </div>
      <DesktopSidebar user={user} />
    </article>
  );
}
