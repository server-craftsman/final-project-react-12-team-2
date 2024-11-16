import { Table, Typography, Input, DatePicker } from "antd";
import { ColumnType } from "antd/es/table";
import { Setting } from "../../../models/api/responsive/admin/setting.response.model";
import { helpers } from "../../../utils";
import { SearchOutlined } from '@ant-design/icons';
import { useState, useMemo } from "react";
import moment from "moment";
import dayjs from 'dayjs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const { RangePicker } = DatePicker;

const columns = [
  {
    title: "ID",
    dataIndex: "id", 
    key: "id",
    render: (_: any, __: any, index: number) => index + 1,
    className: "font-medium"
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type", 
    render: (type: string) => (
      <span className={`badge ${type.toLowerCase().replace(/\s+/g, '-')} px-3 py-1 rounded-full text-sm font-medium shadow-sm`}>
        {type}
      </span>
    )
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (amount: number) => (
      <span className="font-semibold text-emerald-600">
        {helpers.moneyFormat(amount)}
      </span>
    )
  },
  {
    title: "Balance Old",
    dataIndex: "balance_old",
    key: "balance_old",
    render: (balance: number) => (
      <span className="text-gray-600">
        {helpers.moneyFormat(balance)}
      </span>
    )
  },
  {
    title: "Balance New", 
    dataIndex: "balance_new",
    key: "balance_new",
    render: (balance: number) => (
      <span className="font-medium text-indigo-600">
        {helpers.moneyFormat(balance)}
      </span>
    )
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "created_at",
    render: (date: string) => (
      <span className="text-gray-600">
        {helpers.formatDate(new Date(date))}
      </span>
    ),
    sorter: (a: any, b: any) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateA - dateB;
    },
    sortDirections: ['ascend', 'descend']
  }
];

const RecentOrder = ({ settings }: { settings: Setting }) => {
  const [search, setSearch] = useState<string>("");
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);
  const [timeRange, setTimeRange] = useState<string>('custom');

  const handleTimeRangeChange = (range: string) => {
    const now = moment();
    let start: moment.Moment | null = null;
    let end: moment.Moment | null = now;

    switch (range) {
      case 'week':
        start = now.clone().subtract(7, 'days');
        break;
      case 'month':
        start = now.clone().subtract(1, 'months');
        break;
      case '6months':
        start = now.clone().subtract(6, 'months');
        break;
      case 'year':
        start = now.clone().subtract(1, 'years');
        break;
      default:
        start = null;
        end = null;
    }

    setDateRange(start && end ? [start, end] : null);
    setTimeRange(range);
  };

  const onSearch = (value: string) => {
    setSearch(value);
  };

  const onDateChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([moment(dates[0].toDate()), moment(dates[1].toDate())]);
    } else {
      setDateRange(null);
    }
  };

  const filteredTransactions = useMemo(() => {
    let transactions = settings?.transactions || [];

    if (search.trim()) {
      transactions = transactions.filter(transaction =>
        transaction.type.toLowerCase().includes(search.toLowerCase()) ||
        transaction.amount.toString().includes(search) ||
        transaction.balance_old.toString().includes(search) ||
        transaction.balance_new.toString().includes(search)
      );
    }

    if (dateRange) {
      transactions = transactions.filter(transaction => {
        const createdAt = moment(transaction.created_at);
        return createdAt.isBetween(dateRange[0], dateRange[1], 'days', '[]');
      });
    }

    return transactions;
  }, [settings?.transactions, search, dateRange]);

  const ExportCSV = ({ transactions }: { transactions: any }) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData: any, fileName: string) => {
        const ws = XLSX.utils.json_to_sheet([]);

        // Add title
        const title = "Transactions Report";
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
            { wch: 15 }, // type
            { wch: 12 }, // amount
            { wch: 15 }, // balance_old
            { wch: 15 }, // balance_new
            { wch: 30 }, // purchase_instructor
            { wch: 30 }, // instructor
            { wch: 20 }, // created_at
            { wch: 30 },  // _id
            { wch: 30 },  // payout_id
            { wch: 30 }  // status
        ];

        // Create workbook and add the worksheet
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };

        // Generate Excel file buffer
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // Create a Blob from the buffer
        const data = new Blob([excelBuffer], { type: fileType });

        // Save the file
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    return (
        <button
            onClick={() => exportToCSV(transactions, "Transactions_Report")}
            className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:from-purple-500 hover:via-pink-600 hover:to-red-600 transition-all duration-300 ease-in-out flex items-center"
        >
            <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h14M12 5l7 7-7 7"
                ></path>
            </svg>
            Export File
        </button>
    );
  };

  return (
    <div className="flex-1 rounded-xl border border-gray-200 bg-white px-6 pb-6 pt-5 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <Typography.Text strong className="text-2xl font-bold text-gray-800">
          Recent Transactions
        </Typography.Text>
        <ExportCSV transactions={filteredTransactions} />
      </div>
      <div className="flex justify-between items-center mb-6 gap-4">
        <Input 
          placeholder="Search transactions..." 
          prefix={<SearchOutlined className="text-gray-400" />} 
          className="rounded-lg border-gray-300 hover:border-indigo-400 focus:border-indigo-500 transition-colors"
          style={{ width: 250 }} 
          onChange={e => onSearch(e.target.value)} 
        />
        <select
          value={timeRange}
          onChange={(e) => handleTimeRangeChange(e.target.value)}
          className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 ease-in-out"
        >
          <option value="custom">Custom Range</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="6months">Last 6 Months</option>
          <option value="year">Last Year</option>
        </select>
        <RangePicker
          value={dateRange ? [dayjs(dateRange[0].toDate()), dayjs(dateRange[1].toDate())] : [null, null]}
          onChange={onDateChange}
          className="rounded-lg border-gray-300 hover:border-indigo-400 focus:border-indigo-500"
        />
      </div>
      <Table 
        columns={columns as ColumnType<any>[]} 
        dataSource={filteredTransactions}
        rowKey="_id"
        pagination={{
          pageSize: 5,
          total: filteredTransactions?.length,
          className: "pt-4"
        }}
        className="shadow-sm"
        rowClassName="hover:bg-gray-50 transition-colors"
      />
    </div>
  );
};

export default RecentOrder;
