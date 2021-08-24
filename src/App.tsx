import "./App.css";
import React, { useState } from "react";
import ThreeCanvas from "./components/ThreeCanvas";
import Upload from "./components/Upload";

function App() {
  const [inUploadView, setInUploadView] = useState(true);

  return (
    <div className="App">
      {inUploadView && <Upload setInUploadView={setInUploadView} />}
      {!inUploadView && <ThreeCanvas />}
    </div>
  );
}

export default App;
