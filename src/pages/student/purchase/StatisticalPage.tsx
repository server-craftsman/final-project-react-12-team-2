import React, { useState, useEffect } from "react";
import Statistical from "../../../components/student/purchase/Statistical";
import { PurchaseService } from "../../../services/purchase/purchase.service";
import { PurchaseStatus } from "../../../app/enums/purchase.status";

const StatisticalPage: React.FC = () => {
  const [purchases, setPurchases] = useState<any[]>([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await PurchaseService.searchForStudentPurchase({
          searchCondition: {    
            cart_no: "",
            course_id: "",
            status: PurchaseStatus.NEW || "",
            is_delete: false,
            purchase_no: ""
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 1000
          }
        }); // Assume this service fetches all purchases
        setPurchases(response.data.data.pageData);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };

    fetchPurchases();
  }, []);

  return <Statistical purchases={purchases} />;
};

export default StatisticalPage;