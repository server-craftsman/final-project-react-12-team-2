import { Table, Tag, message, Modal } from 'antd';
import paymentsData from '../../../data/payouts.json';
import transactionsData from '../../../data/admin_transactions.json'; 
import { useState, useEffect } from 'react';
import { Payout, PayoutStatusEnum } from '../../../models/Payout';
import { moneyFormat } from '../../../utils/helper';

interface ViewPaymentProps {
  searchQuery: string;
}

const ViewPayment: React.FC<ViewPaymentProps> = ({ searchQuery }) => {
  const [payments, setPayments] = useState<Payout[]>(() =>
    paymentsData.payments.map((payment) => ({
      ...payment,
      status: payment.status as PayoutStatusEnum,
    }))
  );
  const [selectedPayoutDetails, setSelectedPayoutDetails] = useState<unknown[]>([]); // Lưu chi tiết payout
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const handleViewDetails = (payoutId: string) => {
    // Lọc dữ liệu chi tiết payout dựa trên payout_id từ admin_transactions.json
    const details = transactionsData.filter(detail => detail.payout_id === payoutId);
    setSelectedPayoutDetails(details); // Cập nhật chi tiết payout
    setIsModalVisible(true);
  };

  const handleApprove = (id: string, status: PayoutStatusEnum) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === id ? { ...payment, status } : payment
      )
    );
    message.success(`Payment ${status === PayoutStatusEnum.COMPLETED ? 'complete' : 'rejected'} successfully.`);
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
    },
    {
      title: 'Transaction',
      key: 'transaction',
      render: (_: unknown, record: Payout) => (
        <button
          onClick={() => handleViewDetails(record.id)} // Sử dụng hàm xử lý chi tiết payout
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
      render: (money: number) => moneyFormat(money),
    },
    {
      title: 'Balance Instructor Paid',
      dataIndex: 'balance_instructor_paid',
      key: 'balance_instructor_paid',
      render: (money: number) => moneyFormat(money),
    },
    {
      title: 'Balance Instructor Received',
      dataIndex: 'balance_instructor_received',
      key: 'balance_instructor_received',
      render: (money: number) => moneyFormat(money),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Completed', value: PayoutStatusEnum.COMPLETED },
        { text: 'Request_Payout', value: PayoutStatusEnum.REQUEST_PAYOUT },
        { text: 'Rejected', value: PayoutStatusEnum.REJECT },
      ],
      onFilter: (value: unknown, record: Payout) => {
        return record.status === value;
      },
      render: (status: PayoutStatusEnum) => (
        <Tag color={status === PayoutStatusEnum.COMPLETED ? 'green' : status === PayoutStatusEnum.REQUEST_PAYOUT ? 'orange' : 'volcano'}>
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
          {record.status === PayoutStatusEnum.REQUEST_PAYOUT && (
            <>
              <button
                onClick={() => handleApprove(record.id, PayoutStatusEnum.COMPLETED)}
                className='bg-green-400 text-white px-4 py-2 rounded-md'
                style={{ width: '85px' }}
              >Approve</button>
              <button
                onClick={() => handleApprove(record.id, PayoutStatusEnum.REJECT)}
                className='bg-red-400 text-white px-4 py-2 rounded-md'
                style={{ width: '85px' }}>
                Reject</button>
            </>
          )}
        </div>
      ),
    },
  ];

  const detailColumns = [
    {
      title: 'Transaction ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Payout ID',
      dataIndex: 'payout_id',
      key: 'payout_id',
    },
    {
      title: 'Payout Amount',
      dataIndex: 'payout_amount',
      key: 'payout_amount',
      render: (money: number) => moneyFormat(money),
    },
    {
      title: 'Date Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Date Updated',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Deleted',
      dataIndex: 'is_deleted',
      key: 'is_deleted',
      render: (isDeleted: boolean) => (isDeleted ? 'Yes' : 'No'),
    },
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

      <Modal
        title="Payout Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={detailColumns}
          dataSource={selectedPayoutDetails}
          rowKey="id"
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default ViewPayment;
