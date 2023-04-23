import "./ProfileAvatar.css";

export default function ProfileAvatar(props) {
  // const backgroundImage = `url("https://assets.cruddur.n5n.org/avatars/${props.id}.jpg")`; // TODO: fix this
  const backgroundImage = `url("https://assets.cruddur.n5n.org/avatars/processed/boba.jpg")`;
  const styles = {
    backgroundImage: backgroundImage,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return <div className="profile-avatar" style={styles}></div>;
}
