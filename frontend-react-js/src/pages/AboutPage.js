import React from "react";
import "./StaticPage.css";

import DesktopNavigation from "../components/DesktopNavigation";
import DesktopSidebar from "../components/DesktopSidebar";

import { checkAuth } from "../lib/CheckAuth";

export default function AboutPage() {
  const [, setPopped] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const dataFetchedRef = React.useRef(false);

  React.useEffect(() => {
    //prevents double call
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    checkAuth(setUser);
  }, []);

  return (
    <article>
      <DesktopNavigation user={user} active={"home"} setPopped={setPopped} />
      <div className="content">
        <h1>About Cruddur</h1>
        <p>
          This is built as part of the{" "}
          <a href="https://aws.cloudprojectbootcamp.com/">
            AWS Cloud Project Bootcamp
          </a>
        </p>
      </div>
      <DesktopSidebar user={user} />
    </article>
  );
}
