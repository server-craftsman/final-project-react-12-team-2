import { PureComponent } from "react";
import { BarChart, Bar, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import payouts from "../../../data/payouts.json"; // Assuming the payouts.json is in the same directory
import { Payout } from "../../../models/prototype/Payout";

// Function to group payouts by month and calculate totals
const groupByMonth = (payments: Payout[]) => {
  const groupedData: {
    [key: string]: {
      balance_origin: number;
      balance_instructor_received: number;
    };
  } = {};

  payments.forEach((payment) => {
    const date = new Date(payment.created_at);
    const month = `${date.getFullYear()}-${date.getMonth() + 1}`; // Format: YYYY-MM

    if (!groupedData[month]) {
      groupedData[month] = {
        balance_origin: 0,
        balance_instructor_received: 0
      };
    }

    groupedData[month].balance_origin += payment.balance_origin;
    groupedData[month].balance_instructor_received += payment.balance_instructor_received;
  });

  // Convert grouped data to array format for chart
  const dataArray = Object.entries(groupedData).map(([name, values]) => ({
    name,
    balance_origin: values.balance_origin,
    balance_instructor_received: values.balance_instructor_received
  }));

  // Sort the dataArray by month (ascending order)
  return dataArray.sort((a, b) => {
    const [yearA, monthA] = a.name.split("-");
    const [yearB, monthB] = b.name.split("-");
    return new Date(Number(yearA), Number(monthA) - 1).getTime() - new Date(Number(yearB), Number(monthB) - 1).getTime();
  });
};

// Access the payments array correctly from the payouts object
const data = groupByMonth(payouts.payments as Payout[]);

export default class Example extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Bar dataKey="balance_origin" fill="green" name="Balance Origin" />
          <Bar dataKey="balance_instructor_received" fill="blue" name="Instructor Received" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
