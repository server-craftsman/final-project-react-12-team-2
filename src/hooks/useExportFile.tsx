import * as XLSX from "xlsx-js-style";
import FileSaver from "file-saver";
import moment from "moment";

const useExportFileXLSX = () => {
  const exportToXLSX = (csvData: any, fileName: string) => {
    const fileTypeXLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtensionXLSX = '.xlsx';

    const ws = XLSX.utils.json_to_sheet([]);

    // Add title
    const title = "Purchase Report";
    XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: 'A1' });

    // Add creation date
    const creationDate = `Created on: ${moment().format('DD-MM-YYYY')}`;
    XLSX.utils.sheet_add_aoa(ws, [[creationDate]], { origin: 'A2' });

    // Merge cells for title and date
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 9 } }
    ];

    // Apply title style
    ws['A1'].s = {
      font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "1F4E78" } },
      alignment: { horizontal: "center" }
    };

    // Apply date style
    ws['A2'].s = {
      font: { italic: true, sz: 12, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "1F4E78" } },
      alignment: { horizontal: "center" }
    };

    // Add data starting from the third row
    XLSX.utils.sheet_add_json(ws, csvData, { origin: 'A3', skipHeader: false });

    // Define a consistent border style
    const borderStyle = {
      top: { style: "thin", color: { hex: "#ff00f3" } },
      bottom: { style: "thin", color: { hex: "#ff00f3" } },
      left: { style: "thin", color: { hex: "#ff00f3" } },
      right: { style: "thin", color: { hex: "#ff00f3" } }
    };

    // Apply styles to the entire sheet
    const range = XLSX.utils.decode_range(ws['!ref'] || '');
    for (let R = 0; R <= range.e.r; ++R) { // Start from row 0 to include title and date
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ c: C, r: R });
        if (!ws[cellAddress]) ws[cellAddress] = {}; // Ensure the cell exists
        ws[cellAddress].s = {
          font: { color: { rgb: "333333" }, sz: 11 },
          alignment: { vertical: "center", horizontal: "center" },
          border: borderStyle,
          fill: { fgColor: { rgb: "F7F7F7" } }
        };
      }
    }

    // Set column widths
    ws['!cols'] = [
      { wch: 30 }, // _id
      { wch: 30 }, // purchase_no
      { wch: 30 }, // status
      { wch: 15 }, // price_paid
      { wch: 15 }, // price
      { wch: 10 }, // discount
      { wch: 30 }, // cart_id
      { wch: 30 }, // course_id
      { wch: 30 }, // student_id
      { wch: 30 }, // instructor_id
      { wch: 30 }, // created_at
      { wch: 15 }, // is_deleted
      { wch: 30 }, // cart_no
      { wch: 30 }, // course_name
      { wch: 30 }, // student_name
      { wch: 30 }  // instructor_name
    ];

     // Freeze the header row
     ws['!freeze'] = { xSplit: 0, ySplit: 3 };

    // Create workbook and add the worksheet
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the buffer
    const data = new Blob([excelBuffer], { type: fileTypeXLSX });

    // Save the file
    FileSaver.saveAs(data, fileName + fileExtensionXLSX);
  };

  const exportToCSV = (csvData: any, fileName: string) => {
    const fileTypeCSV = 'text/csv;charset=UTF-8';
    const fileExtensionCSV = '.csv';

    if (!csvData || csvData.length === 0) {
      console.error("No data available to export.");
      return;
    }

    const headers = Object.keys(csvData[0]);
    const csvRows = [];

    csvRows.push(headers.map(header => `"${header}"`).join(','));

    csvData.forEach((row: any) => {
      const values = headers.map(header => {
        const value = row[header] !== null && row[header] !== undefined ? row[header] : '';
        const escapedValue = (`${value}`).replace(/"/g, '""');
        return `"${escapedValue}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.map(row => row.split(',').join(',')).join('\n');
    const data = new Blob([csvString], { type: fileTypeCSV });
    FileSaver.saveAs(data, fileName + fileExtensionCSV);
  };

  const exportToJSON = (jsonData: any, fileName: string) => {
    const fileTypeJSON = 'application/json;charset=UTF-8';
    const fileExtensionJSON = '.json';
    const data = new Blob([JSON.stringify(jsonData, null, 2)], { type: fileTypeJSON });
    FileSaver.saveAs(data, fileName + fileExtensionJSON);
  };

  return { exportToXLSX, exportToCSV, exportToJSON };
};

export default useExportFileXLSX;