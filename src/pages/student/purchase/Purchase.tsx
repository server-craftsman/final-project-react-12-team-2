import React, { useEffect, useState, useMemo } from "react";
import { PurchaseService } from "../../../services/purchase/purchase.service";
import { PurchaseStatus } from "../../../app/enums";
import { Table, Badge, Layout, Select, Input, Button } from "antd";
import { EyeOutlined, PrinterOutlined } from "@ant-design/icons";
import { helpers } from "../../../utils";
import LoadingAnimation from "../../../app/UI/LoadingAnimation";
import DetailModal from './DetailModal';
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import moment from "moment";
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
  const [selectedFilters, setSelectedFilters] = useState<any>({ initialSearchCondition });

  useEffect(() => {
    fetchData(); // Fetch data with default input when the page loads
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const searchCondition = {
        ...filters,
        status: filters.status.length > 0 ? filters.status : PurchaseStatus.ALL
      };

      if (searchTerm) {
        searchCondition.purchase_no = searchTerm;
        // searchCondition.cart_no = searchTerm;
        // searchCondition.instructor_name = searchTerm;
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
        setFilteredPurchases(data.filter((purchase) => purchase.status !== ""));
        setTotalResults(response.data.data.pageInfo.totalItems);
      }
    } catch (error) { 
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters((prevFilters: any) => {
      const updatedFilters = {
        ...prevFilters,
        purchase_no: searchTerm,
        status: selectedFilters.status,
      };
      fetchDataWithFilters(updatedFilters);
      return updatedFilters;
    });
  };

  const fetchDataWithFilters = async (filters: any) => {
    setLoading(true);
    try {
      const searchCondition = {
        ...filters,
        status: filters.status.length > 0 ? filters.status : PurchaseStatus.ALL
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
        setFilteredPurchases(data.filter((purchase) => purchase.status !== ""));
        setTotalResults(response.data.data.pageInfo.totalItems);
      }
    } catch (error) { 
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilters({ status: value });
  };

  const handleActionClick = (record: any) => {
    setSelectedPurchase(record);
    setIsModalVisible(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const ExportData = ({ transactions }: { transactions: any }) => {
    const handleExport = () => {
      const fileName = "Purchase_Report_" + moment().format('DD-MM-YYYY');
      exportToXLSX(transactions, fileName);
    };

    const fileTypeXLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtensionXLSX = '.xlsx';

    const exportToXLSX = (csvData: any, fileName: string) => {
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
  };


  const columns = [
    {
      title: "Purchase No",
      dataIndex: "purchase_no",
      key: "purchase_no"
    },{
      title: "Course",
      dataIndex: "course_name",
      key: "course_name"
    },
    {
      title: "Cart No",
      dataIndex: "cart_no",
      key: "cart_no"
    },
    {
      title: 'Instructor',
      dataIndex: "instructor_name",
      key: "instructor_name"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
      title: 'Price Cost',
      dataIndex: 'price_paid',
      key: 'price_paid',
      render: (price: number) => helpers.moneyFormat(price),
    },
    {
      title: 'Created At',
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      render: (date: string) => helpers.formatDate(new Date(date))
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleActionClick(record)}>
          <EyeOutlined />
        </Button>
      )
    }
  ];

  return (
    <Layout>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-gold-500 font-sans text-4xl font-bold">Purchase Invoice</h1>
            <div>
              <Button icon={<PrinterOutlined />} onClick={handlePrint} style={{ marginRight: 8 }}>
                Print
              </Button>
              <ExportData transactions={filteredPurchases} />
            </div>
          </div>

          <hr className="mb-8" />

          {loading ? <LoadingAnimation /> : null}

          <div className="flex items-center justify-between mb-4">
            <Search
              placeholder="Search by purchase number"
              enterButton={<Button type="primary" onClick={handleSearch}>Search</Button>}
              style={{ width: 300 }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              placeholder="Add Filters"
              style={{ width: 200 }}
              onChange={handleFilterChange}
              options={[
                { label: "All", value: "" },
                // { label: "Approved", value: "Approved" },
                // { label: "Rejected", value: "Rejected" },
                { label: "Completed", value: "completed" },
                { label: "New", value: "new" },
                { label: "Request Paid", value: "request_paid" }
              ]}
            />
          </div>

          <div className="pagination-info flex items-center justify-between mb-4">
            <span>
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, totalResults)} of {totalResults} results
            </span>
            <span className="ml-4">
              Results per page: 
              <Select
                defaultValue={pageSize}
                style={{ width: 80, marginLeft: 8 }}
                onChange={(value) => setPageSize(value)}
              >
                <Option value={5}>5</Option>
                <Option value={10}>10</Option>
                <Option value={20}>20</Option>
              </Select>
            </span>
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
};

export default Purchase;
