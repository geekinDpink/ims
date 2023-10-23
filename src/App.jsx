import { useState } from "react";
import { read, utils, writeFile } from "xlsx";

const App = () => {
  const [data, setData] = useState([]);
  const [selItem, setSelItem] = useState({});
  const [addOrMinusQty, setAddOrMinusQty] = useState(0);

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

  const handleExportFile = async () => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "new inventory");

    await writeFile(workbook, "inventory.xlsx", { compression: true });
    // Upload the file to your server here
    // For example, you could use the Fetch API to upload the file to a backend endpoint
  };

  // Submit for search item
  const handleSubmit = (event) => {
    event.preventDefault();

    const itemBarCode = event.target[0].value;
    const searchResults = data.filter((row) => row.BARCODE === itemBarCode);
    setSelItem(searchResults[0]);
    console.log("search result", searchResults[0]);
  };

  const changeTotal = () => {
    const dataCopy = [...data];
    const selItemIndex = dataCopy.findIndex(
      (item) => item.BARCODE === selItem.BARCODE
    );
    dataCopy[selItemIndex].QUANTITY = selItem.QUANTITY;
    setData(dataCopy);
    setSelItem({});
  };

  const addQty = () => {
    const dataCopy = [...data];
    const selItemIndex = dataCopy.findIndex(
      (item) => item.BARCODE === selItem.BARCODE
    );
    const currentQty = dataCopy[selItemIndex].QUANTITY
      ? parseInt(dataCopy[selItemIndex].QUANTITY)
      : 0;
    const newItemQty = currentQty + parseInt(addOrMinusQty);
    dataCopy[selItemIndex].QUANTITY = newItemQty;
    setData(dataCopy);
    setSelItem({});
  };

  const minusQty = () => {
    const dataCopy = [...data];
    const selItemIndex = dataCopy.findIndex(
      (item) => item.BARCODE === selItem.BARCODE
    );
    const currentQty = dataCopy[selItemIndex].QUANTITY
      ? parseInt(dataCopy[selItemIndex].QUANTITY)
      : 0;
    const newItemQty = currentQty - parseInt(addOrMinusQty);
    dataCopy[selItemIndex].QUANTITY = newItemQty;
    setData(dataCopy);
    setSelItem({});
  };

  return (
    <div>
      <div>
        <h3>Upload Inventory File</h3>
        <input type="file" onChange={handleFileUpload} />
      </div>
      <div>
        <h3>Search Item</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Enter barcode" />
          <button type="submit">Search</button>
        </form>

        {selItem ? (
          <div>
            <p>Description: {selItem.DESCRIPTION}</p>
            <p>Barcode: {selItem.BARCODE}</p>
            <p>Weight:{selItem.WEIGHT}</p>
            <p>Unit: {selItem.UNIT}</p>
            <p>
              Qty:
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
                  console.log("e", e.target.value);
                  setAddOrMinusQty(e.target.value);
                }}
                value={addOrMinusQty}
              />
            </p>
            <button onClick={addQty}>Add New Quantity</button>
            <button onClick={minusQty}>Minus New Quantity</button>
          </div>
        ) : (
          <p>Empty</p>
        )}
      </div>

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
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={row.DESCRIPTION}>
                  <td>{row.DESCRIPTION}</td>
                  <td>{row.BARCODE}</td>
                  <td>{row.WEIGHT}</td>
                  <td>{row.UNIT}</td>
                  <td>{row.QUANTITY ?? "-"}</td>
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
  );
};

export default App;
