import React from "react";
import { Checkbox } from "antd";

const PurchaseCheckbox: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ checked, onChange, disabled }) => {
  return (
    <div>
      <Checkbox 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)} 
        disabled={disabled} 
      />
    </div>
  );
};

export default PurchaseCheckbox;
