import React, { useEffect, useState, useMemo } from "react";
import { PurchaseService } from "../../../services/purchase/purchase.service";
import { PurchaseStatus } from "../../../app/enums";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import { Card, Row, Col } from "antd";
import { helpers } from "../../../utils";
const Purchase: React.FC = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredPurchases, setFilteredPurchases] = useState<any[]>([]);

  const initialSearchCondition = useMemo(
    () => ({
      purchase_no: "",
      cart_no: "",
      course_id: "",
      status: PurchaseStatus.ALL,
      is_delete: false
    }),
    []
  );

  useEffect(() => {
    setLoading(true);
    PurchaseService.searchForStudentPurchase({
      searchCondition: initialSearchCondition,
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      }
    })
      .then((response) => {
        if (response.data.data) {
          const data = response.data.data.pageData as any[];
          setFilteredPurchases(data.filter((purchase) => purchase.status === PurchaseStatus.ALL));
          setPurchases(data);
        }
      })
      .catch((error) => {
        console.error("Initial search error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [initialSearchCondition]);

  const handleSearch = (searchCondition: any) => {
    const searchTerm = searchCondition.toLowerCase();
    const filtered = purchases.filter((purchase) => {
      return Object.values(purchase).some((value) => value?.toString().toLowerCase().includes(searchTerm));
    });
    setFilteredPurchases(filtered);
  };

  return (
    <div className="min-h-fit w-full max-w-[1200px] p-12">
      <h1 className="text-gold-500 mb-8 font-sans text-4xl font-bold">Purchase Dashboard</h1>
      {loading ? <p>Loading...</p> : null}
      <CustomSearch onSearch={handleSearch} placeholder="Search any item" />
      <Row gutter={[12, 12]} className="mt-10 w-full">
        {filteredPurchases.map((purchase) => (
          <Col key={purchase._id} xs={24}>
            <Card
              title={
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#333"
                  }}
                >
                  {purchase.course_name}
                </span>
              }
              hoverable
              className="hover:shadow-3xl transform rounded-3xl border-0 shadow-2xl transition-all duration-500 hover:scale-105"
              style={{
                background: "linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(245,245,245,1))",
                borderBottomLeftRadius: "1.5rem",
                borderBottomRightRadius: "1.5rem"
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <p className="border-gold-300 flex items-center justify-between border-b pb-3">
                  <span className="text-gold-700 font-bold">Purchase No:</span>
                  <span className="text-gray-800">{purchase.purchase_no}</span>
                </p>
                <p className="border-gold-300 flex items-center justify-between border-b pb-3">
                  <span className="text-gold-700 font-bold">Status:</span>
                  <span className="bg-gold-200 text-gold-800 rounded-full px-4 py-2">{purchase.status}</span>
                </p>
                <p className="border-gold-300 flex items-center justify-between border-b pb-3">
                  <span className="text-gold-700 font-bold">Price Paid:</span>
                  <span className="text-2xl font-semibold text-green-700">{helpers.moneyFormat(purchase.price_paid)}</span>
                </p>
                <p className="border-gold-300 flex items-center justify-between border-b pb-3">
                  <span className="text-gold-700 font-bold">Original Price:</span>
                  <span className="text-gray-600 line-through">{helpers.moneyFormat(purchase.price)}</span>
                </p>
                <p className="border-gold-300 flex items-center justify-between border-b pb-3">
                  <span className="text-gold-700 font-bold">Instructor:</span>
                  <span className="text-gray-800">{purchase.instructor_name}</span>
                </p>
                <p className="border-gold-300 flex items-center justify-between border-b pb-3">
                  <span className="text-gold-700 font-bold">Created At:</span>
                  <span className="text-gray-700">{helpers.formatDate(purchase.created_at)}</span>
                </p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Purchase;
