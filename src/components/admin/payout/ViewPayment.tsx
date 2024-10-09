import { Table, Tag, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import paymentsData from '../../../data/payouts.json';
import { useState, useEffect } from 'react';
import { Payout, PayoutStatusEnum } from '../../../models/Payout';

interface ViewPaymentProps {
  searchQuery: string;
}

const ViewPayment: React.FC<ViewPaymentProps> = ({ searchQuery }) => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payout[]>(() => 
    paymentsData.payments.map((payment) => ({
      ...payment,
      status: payment.status as PayoutStatusEnum,
    }))
  );

  useEffect(() => {
    const filteredPayments = paymentsData.payments
      .filter(payment => 
        payment.payout_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.instructor_id.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(payment => ({
        ...payment,
        status: payment.status as PayoutStatusEnum,
      }));
    setPayments(filteredPayments);
  }, [searchQuery]);

  const handleViewDetails = (paymentId: string) => {
    navigate(`/admin/view-payment/${paymentId}`, { state: { paymentId } });
  };

  const handleApprove = (paymentId: string, status: PayoutStatusEnum) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === paymentId ? { ...payment, status } : payment
      )
    );
    message.success(`Payment ${status === PayoutStatusEnum.COMPLETED ? 'approved' : 'CANCELLED'} successfully.`);
  };

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
      render: (_: unknown, record: Payout) => (
        <button
          onClick={() => handleViewDetails(record.id)}
          className='text-black px-4 py-2 rounded-md'
          style={{ width: '100px', textAlign: 'left' }}
        >
          View Details
        </button>
      ),
    },
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
        { text: 'Completed', value: PayoutStatusEnum.COMPLETED },
        { text: 'Pending', value: PayoutStatusEnum.PENDING },
        { text: 'Cancelled', value: PayoutStatusEnum.REJECT },
      ],
      onFilter: (value: any, record: Payout) => {
        return record.status === value;
      },
      render: (status: PayoutStatusEnum) => (
        <Tag color={status === PayoutStatusEnum.COMPLETED ? 'green' : status === PayoutStatusEnum.PENDING ? 'orange' : 'volcano'}>
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
      render: (_: unknown, record: Payout) => (
        <div className='flex justify-between items-center' style={{ minHeight: '48px' }}>
          {record.status === PayoutStatusEnum.PENDING && (
            <>
              <button
                onClick={() => handleApprove(record.id, PayoutStatusEnum.COMPLETED)}
                className='bg-green-400 text-white px-4 py-2 rounded-md'
                style={{ width: '85px' }}
              >
                Approve
              </button>
              <button
                onClick={() => handleApprove(record.id, PayoutStatusEnum.REJECT)}
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
      <Table<Payout>
        className="shadow-lg"
        columns={columns}
        dataSource={payments}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        rowClassName={() => 'align-middle'}
      />
    </div>
  );
};

export default ViewPayment;
