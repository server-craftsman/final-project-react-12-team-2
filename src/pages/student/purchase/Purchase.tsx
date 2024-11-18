import React, { useEffect, useState, useMemo, useCallback } from "react";
import { PurchaseService } from "../../../services/purchase/purchase.service";
import { PurchaseStatus } from "../../../app/enums";
import { ROUTER_URL } from "../../../const/router.path";
import { Table, Badge, Layout, Select, Input, Button, DatePicker } from "antd";
import { EyeOutlined, PrinterOutlined } from "@ant-design/icons";
import { helpers } from "../../../utils";
import LoadingAnimation from "../../../app/UI/LoadingAnimation";
import DetailModal from './DetailModal';
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import useExportFileXLSX from "../../../hooks/useExportFile";
const { Content } = Layout;
const { Option } = Select;
const { Search } = Input;

const Purchase: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredPurchases, setFilteredPurchases] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const initialSearchCondition = useMemo(
    () => ({
      purchase_no: "",
      cart_no: "",
      course_id: "",
      status: "",
      is_delete: false
    }),
    []
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<any>(initialSearchCondition);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [selectedFilters, setSelectedFilters] = useState<any>({ ...initialSearchCondition, status: PurchaseStatus.ALL });
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);
  const navigate = useNavigate();
  const { exportToXLSX } = useExportFileXLSX();

  useEffect(() => {
    fetchData(); // Fetch data with default input when the page loads
  }, []);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await PurchaseService.searchForStudentPurchase({
          searchCondition: {
            status: PurchaseStatus.NEW || "",
            is_delete: false,
            purchase_no: "",
            cart_no: "",
            course_id: ""
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 10
          }
        }); // Fetch purchases
        setFilteredPurchases(response.data.data.pageData);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };

    fetchPurchases();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const searchCondition = {
        ...filters,
        status: filters.status.length > 0 ? filters.status : PurchaseStatus.ALL,
        startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined,
        endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined,
      };

      if (searchTerm) {
        searchCondition.purchase_no = searchTerm;
      }

      const response = await PurchaseService.searchForStudentPurchase({
        searchCondition,
        pageInfo: {
          pageNum: currentPage,
          pageSize: pageSize
        }
      });

      if (response.data.data) {
        const data = response.data.data.pageData as any[];
        setFilteredPurchases(data.filter((purchase) => {
          const createdAt = moment(purchase.created_at);
          return purchase.status !== "" &&
            (!startDate || createdAt.isSameOrAfter(startDate, 'day')) &&
            (!endDate || createdAt.isSameOrBefore(endDate, 'day'));
        }));
        setTotalResults(response.data.data.pageInfo.totalItems);
      }
    } catch (error) { 
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm, startDate, endDate, currentPage, pageSize]);

  const handleSearch = useCallback(() => {
    setFilters((prevFilters: any) => {
      const updatedFilters = {
        ...prevFilters,
        purchase_no: searchTerm,
        status: selectedFilters.status,
      };
      fetchDataWithFilters(updatedFilters);
      return updatedFilters;
    });
  }, [searchTerm, selectedFilters.status]);

  const fetchDataWithFilters = useCallback(async (filters: any) => {
    setLoading(true);
    try {
      const searchCondition = {
        ...filters,
        status: filters.status.length > 0 ? filters.status : PurchaseStatus.ALL,
        startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined,
        endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined,
      };

      const response = await PurchaseService.searchForStudentPurchase({
        searchCondition,
        pageInfo: {
          pageNum: currentPage,
          pageSize: pageSize
        }
      });

      if (response.data.data) {
        const data = response.data.data.pageData as any[];
        setFilteredPurchases(data.filter((purchase) => {
          const createdAt = moment(purchase.created_at);
          return purchase.status !== "" &&
            (!startDate || createdAt.isSameOrAfter(startDate, 'day')) &&
            (!endDate || createdAt.isSameOrBefore(endDate, 'day'));
        }));
        setTotalResults(response.data.data.pageInfo.totalItems);
      }
    } catch (error) { 
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, currentPage, pageSize]);

  const handleFilterChange = useCallback((value: string) => {
    setSelectedFilters({ status: value });
  }, []);

  const handleActionClick = useCallback((record: any) => {
    setSelectedPurchase(record);
    setIsModalVisible(true);
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const ExportData = useCallback(({ transactions }: { transactions: any }) => {
    const handleExport = () => {
      const fileName = "Purchase_Report_" + moment().format('DD-MM-YYYY');
      exportToXLSX(transactions, fileName);
    };

    return (
      <div className="relative inline-block text-left">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
          >
            Export to XLSX
            <svg
              className="ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3.75a.75.75 0 01.75.75v5.69l2.72-2.72a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 111.06-1.06l2.72 2.72V4.5A.75.75 0 0110 3.75z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }, [exportToXLSX]);

  const handleDateChange = useCallback((dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    setStartDate(dates ? moment(dates[0]?.toDate()) : null);
    setEndDate(dates ? moment(dates[1]?.toDate()) : null);
  }, []);

  const totalCourses = useMemo(() => {
    const courseIds = new Set(filteredPurchases.map(purchase => purchase.course_id));
    return courseIds.size;
  }, [filteredPurchases]);

  const columns = useMemo(() => [
    {
      title: "Purchase No",
      dataIndex: "purchase_no",
      key: "purchase_no",
      width: 100,
    },
    {
      title: "Course",
      dataIndex: "course_name",
      key: "course_name",
      width: 100,
      render: (text: string, record: any) => (
        <Link to={`/course/${record.course_id}`} className="hover:underline hover:text-gold" title={`Go to course: ${text}`}>{text}</Link>
      ),
    },
    {
      title: "Instructor",
      dataIndex: "instructor_name",
      key: "instructor_name",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 80,
      render: (status: string) => (
        <Badge
          status={
            status === "Approved" ? "success" :
            status === "Rejected" ? "error" :
            status === "new" ? "processing" :
            "default"
          }
          text={status}
        />
      ),
    },
    {
      title: "Cart No",
      dataIndex: "cart_no",
      key: "cart_no",
      width: 100,
    },
    {
      title: 'Price Cost',
      dataIndex: 'price_paid',
      key: 'price_paid',
      width: 100,
      render: (price: number) => helpers.moneyFormat(price),
    },
    {
      title: 'Created At',
      dataIndex: "created_at",
      key: "created_at",
      width: 100,
      sorter: (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      render: (date: string) => helpers.formatDate(new Date(date))
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 80,
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleActionClick(record)}>
          <EyeOutlined />
        </Button>
      )
    }
  ], [handleActionClick]);

  if (loading) {
    return <LoadingAnimation />;
  } else {
    return (
      <Layout>
      <Layout>
        <Content
          style={{
            margin: 0,
            minHeight: 280,
            maxWidth: '100%',
            overflowX: 'hidden',
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 flex-wrap">
            <h1 className="text-gold-500 font-sans text-2xl md:text-4xl font-bold mb-2 md:mb-0">Purchase Invoice</h1>
            <div className="flex items-center space-x-2 mt-2 md:mt-0">
              <Button type="link" onClick={() => navigate(ROUTER_URL.STUDENT.STATISTICAL)}>
                <EyeOutlined /> Statistical
              </Button>
              <Button icon={<PrinterOutlined />} onClick={handlePrint} className="mr-2">
                Print
              </Button>
              <ExportData transactions={filteredPurchases} />
            </div>
          </div>

          <hr className="mb-8" />        
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 flex-wrap">
            <Search
              placeholder="Search by purchase number"
              enterButton={<Button type="primary" onClick={handleSearch} style={{ backgroundColor: '#1a237e', borderColor: '#1a237e' }}>Search</Button>}
              className="w-full md:w-1/3 mb-2 md:mb-0"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              placeholder="Add Filters"
              className="w-full md:w-1/4 mb-2 md:mb-0"
              onChange={handleFilterChange}
              options={[
                { label: "All", value: "" },
                { label: "Completed", value: "completed" },
                { label: "New", value: "new" },
                { label: "Request Paid", value: "request_paid" }
              ]}
            />
            <DatePicker.RangePicker
              className="w-full md:w-1/3"
              onChange={handleDateChange}
            />
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <span className="text-lg font-semibold">Total Courses Purchased: {totalCourses}</span>
          </div>
          <hr className="mt-4" />  
          <div className="pagination-info mt-4 flex flex-col md:flex-row items-center justify-between mb-4 flex-wrap">
            <span>
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, totalResults)} of {totalResults} results
            </span>
            <div className="flex items-center mt-2 md:mt-0">
              <span className="mr-2">Results per page:</span>
              <Select
                defaultValue={pageSize}
                className="w-20"
                onChange={(value) => setPageSize(value)}
              >
                <Option value={5}>5</Option>
                <Option value={10}>10</Option>
                <Option value={20}>20</Option>
              </Select>
            </div>
          </div>

          <Table
            dataSource={filteredPurchases}
            columns={columns}
            rowKey="_id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalResults,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              },
              className: "pt-4",
              position: ["bottomLeft"],
              rootClassName: "flex justify-center"
            }}
          />

          {selectedPurchase && (
            <DetailModal
              visible={isModalVisible}
              onClose={() => setIsModalVisible(false)}
              details={selectedPurchase}
            />
          )}
        </Content>
      </Layout>
      </Layout>
    );
  }
};

export default Purchase;
