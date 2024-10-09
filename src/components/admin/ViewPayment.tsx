import { Table, Tag, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import paymentsData from '../../data/payouts.json';
import { Payment } from '../../models/Payout'; 
import { Key, useState } from 'react';

const ViewPayment = ({ searchQuery }: { searchQuery: string }) => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState(paymentsData.payments);

  const handleViewDetails = (paymentId: string) => {
    navigate(`/admin/view-payment/${paymentId}`, { state: { paymentId } });
  };

  const handleApprove = (paymentId: string, status: 'COMPLETED' | 'CANCELLED') => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === paymentId ? { ...payment, status } : payment
      )
    );
    message.success(`Payment ${status === 'COMPLETED' ? 'approved' : 'cancelled'} successfully.`);
  };

  const filteredPayments = payments.filter((payment) =>
    payment.instructor_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.payout_no.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  const columns = [
    {
      title: 'Payout No',
      dataIndex: 'payout_no',
      key: 'payout_no',
    },
    {
      title: 'Instructor ID',
      dataIndex: 'instructor_id',
      key: 'instructor_id',
    }
    ,
    {
      title: 'Transaction',
      key: 'transaction',
      render: (_: unknown, record: Payment) => (
        <button
          onClick={() => handleViewDetails(record.id)}
          className='text-black px-4 py-2 rounded-md'
          style={{ width: '100px', textAlign: 'left' }}
        >
          View Details
        </button>
      ),
    },
    // {
    //   title: 'Instructor Ratio',
    //   dataIndex: 'instructor_ratio',
    //   key: 'instructor_ratio',
    //   render: (ratio: number) => `${(ratio * 100).toFixed(2)}%`, 
    // },
    {
      title: 'Balance Origin',
      dataIndex: 'balance_origin',
      key: 'balance_origin',
      render: (amount: number) => `$${amount.toFixed(2)}`, 
    },
    {
      title: 'Balance Instructor Paid',
      dataIndex: 'balance_instructor_paid',
      key: 'balance_instructor_paid',
      render: (amount: number) => `$${amount.toFixed(2)}`, 
    },
    {
      title: 'Balance Instructor Received',
      dataIndex: 'balance_instructor_received',
      key: 'balance_instructor_received',
      render: (amount: number) => `$${amount.toFixed(2)}`, 
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Completed', value: 'COMPLETED' },
        { text: 'Pending', value: 'PENDING' },
        { text: 'Cancelled', value: 'CANCELLED' },
      ],
      onFilter: (value: string | Key, record: Payment) => {
        return record.status === value;
      },
      render: (status: string) => (
        <Tag color={status === 'COMPLETED' ? 'green' : status === 'PENDING' ? 'orange' : 'volcano'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Date Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: Payment) => (
        <div className='flex justify-between items-center' style={{ minHeight: '48px' }}>
          {record.status === 'PENDING' && (
            <>
              <button
                onClick={() => handleApprove(record.id, 'COMPLETED')}
                className='bg-green-400 text-white px-4 py-2 rounded-md'
                style={{ width: '85px' }}
              >
                Approve
              </button>
              <button
                onClick={() => handleApprove(record.id, 'CANCELLED')}
                className='bg-red-400 text-white px-4 py-2 rounded-md'
                style={{ width: '85px' }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      ),
    }
  ];

  return (
    <div className="p-4">
      <Table<Payment>
        className="shadow-lg"
        columns={columns}
        dataSource={filteredPayments}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        rowClassName={() => 'align-middle'}
      />
    </div>
  );
};

export default ViewPayment;
