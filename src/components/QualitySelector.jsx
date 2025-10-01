import React from 'react';
import { Select } from './ui/select';

const QualitySelector = ({ value, onChange }) => {
  return (
    <div className="quality-selector">
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Graphics Quality" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">منخفض / Low</SelectItem>
          <SelectItem value="medium">متوسط / Medium</SelectItem>
          <SelectItem value="high">عالي / High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default QualitySelector;