import { useState } from "react";
import { read, utils } from "xlsx";

const App = () => {
  const [data, setData] = useState([]);

  const handleFileUpload = async (event) => {
    const data = await parseExcelFile(event.target.files[0]);
    setData(data);
  };

  const parseExcelFile = async (file) => {
    console.log("file", file);
    const fileAB = await file.arrayBuffer();
    const workbook = read(fileAB);
    console.log("workbook", workbook);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = utils.sheet_to_json(worksheet);
    console.log("excel sheet data", data);
    return data;
  };

  const handleSubmit = async () => {
    // Upload the file to your server here
    // For example, you could use the Fetch API to upload the file to a backend endpoint
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={handleSubmit}>Submit</button>
      <div>
        <h3>Table Preview</h3>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>BARCODE</th>
              <th>WEIGHT</th>
              <th>UNIT</th>
              <th>QUANTITY</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.DESCRIPTION}>
                <td>{row.DESCRIPTION}</td>
                <td>{row.BARCODE}</td>
                <td>{row.WEIGHT}</td>
                <td>{row.UNIT}</td>
                <td>{row.QUANTITY ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
