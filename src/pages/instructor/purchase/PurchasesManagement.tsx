import React, { useState } from "react";
import ViewPurchase from "../../../components/instructor/purchase/ViewPurchase";
import purchasesData from "../../../data/purchases.json";

const PurchasesManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleRequest = () => {
    console.log("Request button clicked");
  };

  const filteredData = purchasesData.filter((purchase) =>
    purchase.purchase_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.price_paid.toString().includes(searchTerm) ||
      purchase.price.toString().includes(searchTerm) ||
      purchase.discount.toString().includes(searchTerm)
  );

  return (
    <ViewPurchase
      filteredData={filteredData}
      onSearch={handleSearch}
      onRequest={handleRequest}
    />
  );
};

export default PurchasesManagement;
