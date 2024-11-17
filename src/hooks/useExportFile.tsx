import * as XLSX from "xlsx";
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

    // Apply styles to the header row
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
      fill: { fgColor: { rgb: "4F81BD" } },
      alignment: { horizontal: "center" },
      border: {
        top: { style: "medium", color: { rgb: "000000" } },
        bottom: { style: "medium", color: { rgb: "000000" } },
        left: { style: "medium", color: { rgb: "000000" } },
        right: { style: "medium", color: { rgb: "000000" } }
      }
    };

    // Apply styles to the entire sheet
    const cellStyle = {
      font: { color: { rgb: "333333" }, sz: 11 },
      alignment: { vertical: "center", horizontal: "center" },
      border: {
        top: { style: "thin", color: { rgb: "CCCCCC" } },
        bottom: { style: "thin", color: { rgb: "CCCCCC" } },
        left: { style: "thin", color: { rgb: "CCCCCC" } },
        right: { style: "thin", color: { rgb: "CCCCCC" } }
      },
      fill: { fgColor: { rgb: "F7F7F7" } }
    };

    const range = XLSX.utils.decode_range(ws['!ref'] || '');
    for (let R = 2; R <= range.e.r; ++R) { // Start from row 2 to skip title and date
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ c: C, r: R });
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = R === 2 ? headerStyle : cellStyle;
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

    // Create workbook and add the worksheet
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the buffer
    const data = new Blob([excelBuffer], { type: fileTypeXLSX });

    // Save the file
    FileSaver.saveAs(data, fileName + fileExtensionXLSX);
  };

  return { exportToXLSX };
};

export default useExportFileXLSX;