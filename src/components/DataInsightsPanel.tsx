import React, { useEffect, useState } from 'react';
import { Producer, TimeRange, DataInsights } from '../types/data';
import { dataService } from '../services/dataService';

interface DataInsightsPanelProps {
  producer: Producer;
  timeRange: TimeRange;
}

export const DataInsightsPanel: React.FC<DataInsightsPanelProps> = ({ producer, timeRange }) => {
  const [insights, setInsights] = useState<DataInsights>({ min: 0, max: 0, average: 0 });

  useEffect(() => {
    const unsubscribe = dataService.subscribeToInsights(data => {
      if (data.producerId === producer.id) {
        setInsights(data.insights);
      }
    });

    // Request insights calculation
    dataService.calculateInsights(producer.id, timeRange);

    return () => unsubscribe();
  }, [producer.id, timeRange]);

  return (
    <div className="card mb-3" style={{ borderLeft: `4px solid ${producer.color}` }}>
      <div className="card-body">
        <h5 className="card-title">{producer.name} Insights</h5>
        <div className="row">
          <div className="col-4">
            <small className="text-muted">Min</small>
            <div className="h5 mb-0">{insights.min.toFixed(2)}</div>
          </div>
          <div className="col-4">
            <small className="text-muted">Max</small>
            <div className="h5 mb-0">{insights.max.toFixed(2)}</div>
          </div>
          <div className="col-4">
            <small className="text-muted">Average</small>
            <div className="h5 mb-0">{insights.average.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};