import { useState } from "react";
import { read, utils, writeFile } from "xlsx";

const App = () => {
  const [data, setData] = useState([]);
  const [selItem, setSelItem] = useState({});
  const [addOrMinusQty, setAddOrMinusQty] = useState(0);
  const [remarkState, setRemarkState] = useState("");
  const [barCodeScan, setBarCodeScan] = useState("");

  const clearSelForm = () => {
    setSelItem({});
    setRemarkState("");
    setAddOrMinusQty(0);
  };

  const handleFileUpload = async (event) => {
    const data = await parseExcelFile(event.target.files[0]);
    setData(data);
  };

  const parseExcelFile = async (file) => {
    const fileAB = await file.arrayBuffer();
    const workbook = read(fileAB);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = utils.sheet_to_json(worksheet);
    const formattedData = [];
    data.forEach((row) => {
      let formattedRow = {};
      for (const key in row) {
        formattedRow[key.toUpperCase()] = row[key];
      }
      formattedData.push(formattedRow);
    });
    return formattedData;
  };

  const handleExportFile = async () => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "new inventory");

    await writeFile(workbook, "inventory.xlsx", { compression: true });
    // Upload the file to your server here
    // For example, you could use the Fetch API to upload the file to a backend endpoint
  };

  const barCodeScanHandler = (event) => {
    setBarCodeScan(event.target.value);
    const itemBarCode = event.target.value;
    const searchResults = data.filter((row) => row.BARCODE === itemBarCode);
    setSelItem(searchResults[0]);
  };

  // Submit for search item
  const handleSubmit = (event) => {
    event.preventDefault();

    const itemBarCode = event.target[0].value;
    const searchResults = data.filter((row) => row.BARCODE === itemBarCode);
    setSelItem(searchResults[0]);
  };

  const changeTotal = () => {
    const dataCopy = [...data];
    const selItemIndex = dataCopy.findIndex(
      (item) => item.BARCODE === selItem.BARCODE,
    );
    dataCopy[selItemIndex].QUANTITY = selItem.QUANTITY;
    dataCopy[selItemIndex].REMARKS = remarkState;
    setData(dataCopy);
    clearSelForm();
  };

  const addQty = () => {
    const dataCopy = [...data];
    const selItemIndex = dataCopy.findIndex(
      (item) => item.BARCODE === selItem.BARCODE,
    );
    const currentQty = dataCopy[selItemIndex].QUANTITY
      ? parseInt(dataCopy[selItemIndex].QUANTITY)
      : 0;
    const newItemQty = currentQty + parseInt(addOrMinusQty);
    dataCopy[selItemIndex].QUANTITY = newItemQty;
    dataCopy[selItemIndex].REMARKS = remarkState;

    setData(dataCopy);
    clearSelForm();
  };

  const minusQty = () => {
    const dataCopy = [...data];
    const selItemIndex = dataCopy.findIndex(
      (item) => item.BARCODE === selItem.BARCODE,
    );
    const currentQty = dataCopy[selItemIndex].QUANTITY
      ? parseInt(dataCopy[selItemIndex].QUANTITY)
      : 0;
    const newItemQty = currentQty - parseInt(addOrMinusQty);
    dataCopy[selItemIndex].QUANTITY = newItemQty;
    dataCopy[selItemIndex].REMARKS = remarkState;
    setData(dataCopy);
    clearSelForm();
  };

  return (
    <body>
      <div>
        <div>
          <h3>Upload Inventory File</h3>
          <input type="file" onChange={handleFileUpload} />
        </div>
        <div>
          <h3>Search Item</h3>
          <h4>Key Bar Code</h4>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter barcode" />
            <button type="submit">Search</button>
          </form>

          <h4>For Barcode Scanner</h4>
          <input
            type="text"
            placeholder="Barcode Scanner"
            name="barcodeScan"
            value={barCodeScan}
            onChange={(e) => {
              barCodeScanHandler(e);
            }}
          />

          {selItem ? (
            <div>
              <p>Description: {selItem.DESCRIPTION}</p>
              <p>Barcode: {selItem.BARCODE}</p>
              <p>Weight:{selItem.WEIGHT}</p>
              <p>Unit: {selItem.UNIT}</p>
              <p>
                Remarks
                <input
                  type="text"
                  placeholder="remarks"
                  name="remarks"
                  onChange={(e) => {
                    setRemarkState(e.target.value);
                  }}
                  value={remarkState}
                />
              </p>
              <p>
                Quantity:
                <input
                  type="number"
                  placeholder="Quantity"
                  name="Quantity"
                  onChange={(e) => {
                    const selItemCopy = { ...selItem };
                    selItemCopy.QUANTITY = e.target.value;
                    setSelItem(selItemCopy);
                  }}
                  value={selItem.QUANTITY ?? 0}
                />
                <button onClick={changeTotal}>Change Total</button>
              </p>
              <p>
                Add or Minus Qty:
                <input
                  type="number"
                  placeholder="addOrMinus"
                  name="addOrMinus"
                  onChange={(e) => {
                    setAddOrMinusQty(e.target.value);
                  }}
                  value={addOrMinusQty}
                />
              </p>
              <button onClick={addQty}>Add New Quantity</button>
              <button onClick={minusQty}>Minus New Quantity</button>
            </div>
          ) : (
            <p>No item found</p>
          )}
        </div>

        <div>
          <h3>Table Preview</h3>
          <table>
            <thead>
              <tr>
                <th>DESCRIPTION</th>
                <th>BARCODE</th>
                <th>WEIGHT</th>
                <th>UNIT</th>
                <th>QUANTITY</th>
                <th>REMARKS</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.DESCRIPTION}>
                    <td>{row.DESCRIPTION}</td>
                    <td>{row.BARCODE}</td>
                    <td>{row.WEIGHT}</td>
                    <td>{row.UNIT}</td>
                    <td>{row.QUANTITY ?? "-"}</td>
                    <td>{row.REMARKS ?? "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No record found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div>
          <button onClick={handleExportFile}>Export File</button>
        </div>
      </div>
    </body>
  );
};

export default App;
