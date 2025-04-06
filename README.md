# Real-time Data Visualization Dashboard

A high-performance real-time data visualization dashboard built with React, TypeScript, Bootstrap. This application demonstrates efficient handling of real-time data streams with optimized rendering and worker-based computations.

## 🚀 Technologies

- **React** - For building the user interface
- **TypeScript** - For type safety and better developer experience
- **Highcharts** - For performant data visualization
- **Web Workers** - For off-main-thread computations
- **WebSocket** - For real-time data streaming
- **Bootstrap** - For responsive layout and UI components

## 🏗️ Architecture


### Performance Optimizations
- Web Worker for data processing
- Efficient data filtering and calculations
- Optimized Highcharts configuration
- Throttled UI updates
- Batched data processing

### Components
- **Chart**: Real-time line chart with zooming capabilities
- **DataInsightsPanel**: Statistical insights for each data producer
- **TimeRangeSelector**: Time window selection controls

## 📊 Features

- Real-time data visualization
- Multiple data producers support
- Statistical insights (min, max, average)
- Adjustable time windows (30s, 1m, 5m)
- Zoom and pan capabilities
- Responsive design
- Performance optimized

## 🛠️ Project Structure

```
src/
├── components/          # React components
│   ├── Chart.tsx
│   ├── DataInsightsPanel.tsx
│   └── TimeRangeSelector.tsx
├── services/           # Data handling services
│   └── dataService.ts
├── workers/            # Web Workers
│   └── dataWorker.ts
├── types/             # TypeScript types
│   └── data.ts
└── App.tsx           # Main application component
```

## 🚦 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## 🔧 Configuration

The application connects to WebSocket endpoints at `ws://127.0.0.1:8000/producer/{id}`. Each producer sends data points containing:
- Timestamp
- Numerical value

## 🎯 Key Implementation Details


### Web Worker Processing


### Highcharts Configuration
- Optimized for real-time updates
- Disabled unnecessary animations
- Configured for performance

## 📈 Performance Considerations

1. **Data Management**
   - Limited history to 20000 points per producer
   - Efficient data structure updates
   - Batched state updates

2. **Rendering Optimization**
   - Memoized chart options
   - Throttled UI updates
   - Efficient data filtering

3. **Resource Usage**
   - Web Worker for heavy computations
   - Controlled memory usage
   - Optimized WebSocket connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this project for learning or as a starting point for your own applications.
