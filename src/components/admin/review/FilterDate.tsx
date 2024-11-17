import React from 'react'
import { DatePicker } from 'antd'

const { RangePicker } = DatePicker

interface FilterDateProps {
  onDateChange: (dates: [any, any] | null) => void;
}

const FilterDate: React.FC<FilterDateProps> = ({ onDateChange }) => {
  const handleRangeChange = (dates: any) => {
    onDateChange(dates)
  }

  return (
    <div>
      <RangePicker 
        onChange={handleRangeChange} 
        format="MMM D, YYYY" 
        suffixIcon={<i className="anticon anticon-calendar" />}
        style={{ borderRadius: '8px', padding: '5px 10px' }}
      />
    </div>
  )
}

export default FilterDate
