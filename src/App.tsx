import "./App.css";
import Editor from "./editor/Editor";

function App() {
  return (
    <>
      <h1>PetriNet Editor</h1>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Editor />
      </div>
    </>
  );
}

export default App;
