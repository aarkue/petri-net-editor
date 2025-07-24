import "./App.css";
import Editor from "../lib/editor/Editor";

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
        <Editor initialNodes={[{id: "test", type: "place", data: {label: "Hi", className: "red"}, position: {x: 0, y: 0}},{id: "test2", type: "transition", data: {label: "Hi", className: "green"}, position: {x: 0, y: 0}}]} />
      </div>
    </>
  );
}

export default App;
