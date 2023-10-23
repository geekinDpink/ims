import React, { useState } from "react";
import { xlsx } from "xlsx";

const FileUploader = () => {
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    // Upload the file to your server here
    // For example, you could use the Fetch API to upload the file to a backend endpoint
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

function App() {
  const [count, setCount] = useState(0);

  const parseExcelFile = (file) => {
    const workbook = xlsx.readFile(file);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);

    return data;
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
