import React from 'react';
import { TimeRange } from '../types/data';

interface TimeRangeSelectorProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  timeRange,
  onTimeRangeChange
}) => {
  const handleRangeChange = (duration: number) => {
    const end = Date.now();
    const start = end - duration;
    onTimeRangeChange({ start, end });
  };

  return (
    <div className="btn-group mb-4" role="group">
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={() => handleRangeChange(30 * 1000)}
      >
        30s
      </button>
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={() => handleRangeChange(60 * 1000)}
      >
        1m
      </button>
      {/* <button
        type="button"
        className="btn btn-outline-primary"
        onClick={() => handleRangeChange(5 * 60 * 1000)}
      >
        5m
      </button> */}
    </div>
  );
};