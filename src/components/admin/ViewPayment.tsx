import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import paymentsData from '../../data/payments.json'; // Adjust the path to your payments data file
import { Payment } from '../../models/Payment'; // Import the Payment interface
import { Key } from 'react';

const ViewPayment = ({ searchQuery }: { searchQuery: string }) => {
  const navigate = useNavigate();

  const handleViewDetails = (paymentId: string) => {
    // Navigate to the payment detail page
    navigate(`/admin/view-payment/${paymentId}`);
  };

  // Filtering payments based on search query (searching in description or reference)
  const filteredPayments = paymentsData.payments.filter((payment) =>
    payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$${amount.toFixed(2)}`, // Format as currency
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Completed', value: true },
        { text: 'Pending', value: false },
      ],
      onFilter: (value: boolean | Key, record: Payment) => {
        return record.status === value;
      },
      render: (status: boolean) => (status ? 'Completed' : 'Pending'),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(), // Format the date
    },
    {
      title: 'Action',
      key: 'action',
    //   sử dụng unknow thay vì any
      render: (_: unknown, record: Payment) => (
        <div>
          <button onClick={() => handleViewDetails(record.id)} className='bg-gradient-tone text-white px-4 py-2 rounded-md'>View Details</button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Table<Payment>
        className="shadow-lg"
        columns={columns}
        dataSource={filteredPayments}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ViewPayment;
