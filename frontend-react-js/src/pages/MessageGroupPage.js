import "./MessageGroupPage.css";
import React from "react";
import { useParams } from "react-router-dom";

import DesktopNavigation from "../components/DesktopNavigation";
import MessageGroupFeed from "../components/MessageGroupFeed";
import MessagesFeed from "../components/MessageFeed";
import MessagesForm from "../components/MessageForm";

import { Auth } from "aws-amplify";

export default function MessageGroupPage() {
  const [messageGroups, setMessageGroups] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  // eslint-disable-next-line no-unused-vars
  const [popped, setPopped] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const dataFetchedRef = React.useRef(false);
  const params = useParams();

  const loadMessageGroupsData = async () => {
    try {
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/message_groups`;
      const res = await fetch(backend_url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
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

  const loadMessageGroupData = async () => {
    try {
      const handle = `@${params.handle}`;
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/messages/${handle}`;
      const res = await fetch(backend_url, {
        method: "GET",
      });
      let resJson = await res.json();
      if (res.status === 200) {
        setMessages(resJson);
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

    loadMessageGroupsData();
    loadMessageGroupData();
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="content messages">
        <MessagesFeed messages={messages} />
        <MessagesForm setMessages={setMessages} />
      </div>
    </article>
  );
}
