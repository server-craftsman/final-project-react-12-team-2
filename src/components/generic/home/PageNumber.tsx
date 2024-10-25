import { Pagination } from "antd";
import React from "react";

interface PageNumberProps {
  currentPage: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

const PageNumber: React.FC<PageNumberProps> = ({ currentPage, total, pageSize, onChange }) => {
  return (
    <div>
      <Pagination
        current={currentPage}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger={false}
        className="luxury-pagination"
        style={{
          fontFamily: "Playfair Display, serif",
          fontSize: "16px",
          color: "#4a4a4a"
        }}
      />
    </div>
  );
};

export default PageNumber;
