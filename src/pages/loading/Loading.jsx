import "./Loading.css";
function Loading({ fullScreen = false }) {
  //console.log("Loading...");
  return (
    <div
      className={
        fullScreen
          ? "full-screen-loading loading-container"
          : "loading-container"
      }
    >
      {/* <img src="/images/Loading.gif" alt="Loading..." /> */}
      <div className="loading-logo">
        <img src="/images/no-text-logo.png" alt="Logo" />
      </div>
    </div>
  );
}

export default Loading;
