import "./MessageGroupsPage.css";
import React from "react";

import DesktopNavigation from "../components/DesktopNavigation";
import MessageGroupFeed from "../components/MessageGroupFeed";

import { Auth } from "aws-amplify";

export default function MessageGroupsPage() {
  const [messageGroups, setMessageGroups] = React.useState([]);
  // eslint-disable-next-line no-unused-vars
  const [popped, setPopped] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const dataFetchedRef = React.useRef(false);

  const loadData = async () => {
    try {
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/message_groups`;
      const res = await fetch(backend_url, {
        method: "GET",
      });
      let resJson = await res.json();
      if (res.status === 200) {
        setMessageGroups(resJson);
      } else {
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkAuth = async () => {
    console.log("checkAuth");
    Auth.currentAuthenticatedUser({
      bypassCache: false,
    })
      .then((user) => {
        console.log("user", user);
        return Auth.currentAuthenticatedUser();
      })
      .then((cognito_user) => {
        setUser({
          display_name: cognito_user.attributes.name,
          handle: cognito_user.attributes.preferred_username,
        });
      })
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    //prevents double call
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    loadData();
    checkAuth();
  }, []);
  return (
    <article>
      <DesktopNavigation
        user={user}
        active={"messages"}
        setPopped={setPopped}
      />
      <section className="message_groups">
        <MessageGroupFeed message_groups={messageGroups} />
      </section>
      <div className="content"></div>
    </article>
  );
}
