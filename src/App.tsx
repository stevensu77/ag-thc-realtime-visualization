import React, { useState, useEffect } from 'react';

import { Producer, TimeRange } from './types/data';
import { Chart } from './components/Chart';
import { DataInsightsPanel } from './components/DataInsightsPanel';
import { TimeRangeSelector } from './components/TimeRangeSelector';
import { dataService } from './services/dataService';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: Date.now() - 30000, // Last 30 seconds
    end: Date.now()
  });

  useEffect(() => {
    const unsubscribe = dataService.subscribeToData(setProducers);
    return () => unsubscribe();
  }, []);

  // Update time range every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRange(current => ({
        start: current.start + 1000,
        end: current.end + 1000
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex align-items-center">
            <h1 className="h3 mb-0">Real-time Data Visualization</h1>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-3">
          <div className="sticky-top pt-3">
            {!producers&&<div>Card is Loading...</div>}
            {producers.map(producer => (
              <DataInsightsPanel
                key={producer.id}
                producer={producer}
                timeRange={timeRange}
              />
            ))}
          </div>
        </div>
        <div className="col-9">
          <div className="row mb-4">
            <div className="col">
              <TimeRangeSelector timeRange={timeRange} onTimeRangeChange={setTimeRange} />
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              {!producers.length&&<div>Chart is Loading...</div>}
              {producers&& <Chart producers={producers} timeRange={timeRange} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;