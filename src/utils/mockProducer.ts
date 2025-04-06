import { DataPoint, Producer } from '../types/data';

const COLORS = [
  '#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce',
  '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'
];

export function createMockProducer(index: number): Producer {
  return {
    id: `producer-${index}`,
    name: `Producer ${index + 1}`,
    color: COLORS[index],
    data: []
  };
}

export function generateDataPoint(lastValue: number): DataPoint {
  const change = (Math.random() - 0.5) * 2;
  return {
    timestamp: Date.now(),
    value: lastValue + change
  };
}

export function generateInitialData(): Producer[] {
  return Array.from({ length: 10 }, (_, i) => createMockProducer(i));
}