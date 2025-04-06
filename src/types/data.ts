export interface DataPoint {
  timestamp: string;
  value: number;
}

export interface Producer {
  id: string;
  name: string;
  color: string;
  data: DataPoint[];
}

export interface TimeRange {
  start: number;
  end: number;
}

export interface DataInsights {
  min: number;
  max: number;
  average: number;
}