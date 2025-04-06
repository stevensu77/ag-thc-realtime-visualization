import { Producer, DataPoint, DataInsights } from '../types/data';

interface WorkerMessage {
  type: 'CALCULATE_INSIGHTS' | 'UPDATE_DATA';
  payload: {
    producers?: Producer[];
    timeRange?: { start: number; end: number };
    producerId?: string;
  };
}

const producersMap = new Map<string, Producer>();

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'UPDATE_DATA':
      if (payload.producers) {
        payload.producers.forEach(producer => {
          producersMap.set(producer.id, producer);
        });
      }
      break;

    case 'CALCULATE_INSIGHTS':
      if (payload.timeRange && payload.producerId) {
        const producer = producersMap.get(payload.producerId);
        if (producer) {
          const insights = calculateInsights(producer, payload.timeRange);
          self.postMessage({
            type: 'INSIGHTS_CALCULATED',
            payload: {
              producerId: payload.producerId,
              insights
            }
          });
        }
      }
      break;
  }
};

function calculateInsights(
  producer: Producer,
  timeRange: { start: number; end: number }
): DataInsights {
  const filteredData = producer.data.filter(point => {
    const timestamp = new Date(point.timestamp).getTime();
    return timestamp >= timeRange.start && timestamp <= timeRange.end;
  });

  if (filteredData.length === 0) {
    return { min: 0, max: 0, average: 0 };
  }

  const values = filteredData.map(point => point.value);
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    average: values.reduce((a, b) => a + b, 0) / values.length
  };
}

export {};