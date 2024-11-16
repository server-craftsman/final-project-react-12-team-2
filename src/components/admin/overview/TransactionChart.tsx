import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Setting } from "../../../models/api/responsive/admin/setting.response.model";

const TransactionChart = ({ settings }: { settings: Setting }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [timeRange, setTimeRange] = useState<string>('custom');

  const handleTimeRangeChange = (range: string) => {
    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = new Date(now.getTime());

    switch (range) {
      case 'week':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        start = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case '6months':
        start = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case 'year':
        start = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        start = null;
        end = null;
    }

    setStartDate(start);
    setEndDate(end);
    setTimeRange(range);
  };

  const filteredData = settings?.transactions
    ?.filter(transaction => {
      const transactionDate = new Date(transaction.created_at);
      return (!startDate || transactionDate >= startDate) && (!endDate || transactionDate <= endDate);
    })
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map(transaction => ({
      date: new Intl.DateTimeFormat('en-GB').format(new Date(transaction.created_at)),
      amount: transaction.amount,
      type: transaction.type,
      balance: transaction.balance_new
    }));

  return (
    <div className="flex h-[30rem] flex-1 flex-col rounded-lg border border-gray-300 bg-white p-6 shadow-md">
      <strong className="font-semibold text-gray-800">Transactions</strong>
      <div className="flex items-center space-x-6 mt-4">
        <select
          value={timeRange}
          onChange={(e) => handleTimeRangeChange(e.target.value)}
          className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition duration-200 ease-in-out"
        >
          <option value="custom">Custom</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="6months">Last 6 Months</option>
          <option value="year">Last Year</option>
        </select>
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => setStartDate(date)}
          selectsStart
          startDate={startDate || undefined}
          endDate={endDate || undefined}
          placeholderText="Start Date"
          className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition duration-200 ease-in-out"
          dateFormat="MMMM d, yyyy"
          isClearable
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          disabled={timeRange !== 'custom'}
        />
        <DatePicker
          selected={endDate}
          onChange={(date: Date | null) => setEndDate(date)}
          selectsEnd
          startDate={startDate || undefined}
          endDate={endDate || undefined}
          minDate={startDate || undefined}
          placeholderText="End Date" 
          className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition duration-200 ease-in-out"
          dateFormat="MMMM d, yyyy"
          isClearable
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          disabled={timeRange !== 'custom'}
        />
      </div>
      <div className="mt-4 w-full flex-1 text-xs">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={filteredData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 10
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="amount" 
              name="Transaction Amount"
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
            />
            <Line 
              type="monotone" 
              dataKey="balance" 
              name="Balance"
              stroke="#82ca9d" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionChart;
