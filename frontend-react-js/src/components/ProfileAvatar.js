import "./ProfileAvatar.css";

export default function ProfileAvatar(props) {
  const backgroundImage = `url("https://assets.cruddur.n5n.org/avatars/processed/${props.id}.jpg")`;
  // const backgroundImage = `url("https://assets.cruddur.n5n.org/avatars/processed/boba.jpg")`;
  const styles = {
    backgroundImage: backgroundImage,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return <div className="profile-avatar" style={styles}></div>;
}
