import React from "react";
import { Checkbox } from "antd";

const PurchaseCheckbox: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ checked, onChange }) => {
  return (
    <div>
      <Checkbox checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </div>
  );
};

export default PurchaseCheckbox;
