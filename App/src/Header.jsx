export const Header = ({ meme, setMeme }) => (
  <div className="header">
    <h1
      id="title"
      style={{
        marginLeft: "35px",
      }}
    >
      Projektarbeit
    </h1>
    <div
      style={{
        flexGrow: "2",
      }}
    ></div>
    <button onClick={() => setMeme(!meme)} className="button buttonHover">
      ---Meme---
    </button>
    <button
      className="button buttonHover"
      style={{
        marginRight: "35px",
      }}
    >
      {" "}
      ---Test---
    </button>
  </div>
);
