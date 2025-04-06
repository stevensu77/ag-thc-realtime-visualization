import { Producer, DataInsights } from '../types/data';

const COLORS = [
  '#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce',
  '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'
];

type DataListener = (producers: Producer[]) => void;
type InsightsListener = (data: { producerId: string; insights: DataInsights }) => void;

class DataService {
  private producers: Map<string, Producer>;
  private dataListeners: Set<DataListener>;
  private insightsListeners: Set<InsightsListener>;
  private worker: Worker;

  constructor() {
    this.producers = new Map();
    this.dataListeners = new Set();
    this.insightsListeners = new Set();

    // Initialize Web Worker
    this.worker = new Worker(new URL('../workers/dataWorker.ts', import.meta.url), {
      type: 'module'
    });

    this.worker.onmessage = (event) => {
      if (event.data.type === 'INSIGHTS_CALCULATED') {
        this.notifyInsightsListeners(event.data.payload);
      }
    };

    // Initialize 10 WebSocket connections
    for (let i = 0; i < 10; i++) {
      this.initializeProducer(i);
    }
  }

  private initializeProducer(index: number) {
    const producerId = `producer-${index}`;
    const producer: Producer = {
      id: producerId,
      name: `Producer ${index + 1}`,
      color: COLORS[index],
      data: []
    };
    this.producers.set(producerId, producer);

    const ws = new WebSocket(`ws://127.0.0.1:8000/producer/${producerId}`);

    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      const currentProducer = this.producers.get(producerId);
      if (currentProducer) {
        currentProducer.data = [...currentProducer.data, ...newData].slice(-80000);
        this.producers.set(producerId, currentProducer);
        
        // Update worker with new data
        this.worker.postMessage({
          type: 'UPDATE_DATA',
          payload: {
            producers: Array.from(this.producers.values())
          }
        });
        
        this.notifyDataListeners();
      }
    };

    ws.onclose = () => {
      console.log(`WebSocket connection closed for producer ${producerId}`);
      setTimeout(() => this.initializeProducer(index), 1000);
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error for producer ${producerId}:`, error);
      ws.close();
    };
  }

  private notifyDataListeners() {
    const producersArray = Array.from(this.producers.values());
    this.dataListeners.forEach(listener => listener(producersArray));
  }

  private notifyInsightsListeners(data: { producerId: string; insights: DataInsights }) {
    this.insightsListeners.forEach(listener => listener(data));
  }

  subscribeToData(listener: DataListener) {
    this.dataListeners.add(listener);
    return () => this.dataListeners.delete(listener);
  }

  subscribeToInsights(listener: InsightsListener) {
    this.insightsListeners.add(listener);
    return () => this.insightsListeners.delete(listener);
  }

  calculateInsights(producerId: string, timeRange: { start: number; end: number }) {
    this.worker.postMessage({
      type: 'CALCULATE_INSIGHTS',
      payload: { producerId, timeRange }
    });
  }

  destroy() {
    this.worker.terminate();
    this.dataListeners.clear();
    this.insightsListeners.clear();
  }
}

export const dataService = new DataService();