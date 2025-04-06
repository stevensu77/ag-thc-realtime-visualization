import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Producer, TimeRange } from '../types/data';

// EST timezone offset in milliseconds (UTC-5)
// -5 hours * 60 minutes * 60 seconds * 1000 milliseconds
const EST_OFFSET = -5 * 60 * 60 * 1000;

// Function to convert UTC time to EST time
const convertToEST = (utcTimestamp: number): number => {
  // During daylight saving time, you would use UTC-4 instead
  // Check if date is in DST period to adjust offset accordingly
  const date = new Date(utcTimestamp);
  
  // Detect if the date is in Daylight Saving Time
  // In the US, DST starts on the second Sunday in March and ends on the first Sunday in November
  const jan = new Date(date.getFullYear(), 0, 1);
  const jul = new Date(date.getFullYear(), 6, 1);
  const stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  const isDST = date.getTimezoneOffset() < stdTimezoneOffset;
  
  // Apply either EST (UTC-5) or EDT (UTC-4) offset
  return utcTimestamp + (isDST ? (EST_OFFSET + 60 * 60 * 1000) : EST_OFFSET);
};

interface ChartProps {
  producers: Producer[];
  timeRange: TimeRange;
}

export const Chart: React.FC<ChartProps> = ({ producers, timeRange }) => {
  const minTime = timeRange.start;
  const maxTime = timeRange.end;

  // Create chart options
  const options = useMemo(() => {
    // Format data for the chart
    const seriesData = producers.map((producer) => ({
      name: producer.name,
      data: producer.data
        .filter((point) => {
          const timestamp = new Date(point.timestamp).getTime();
          return timestamp >= minTime && timestamp <= maxTime;
        })
        .map((point) => {
          // Convert timestamp to EST time
          const utcTime = new Date(point.timestamp).getTime();
          const estTime = convertToEST(utcTime);
          return [estTime, point.value];
        }),
      color: producer.color,
      type: 'line' as const,
    }));

    return {
      chart: {
        type: 'line',
        animation: false,
        style: { fontFamily: 'Arial, sans-serif' },
        zoomType: 'x',
      },
      title: {
        text: 'Real-time Data Visualization (EST Timezone)',
      },
      xAxis: {
        type: 'datetime',
        min: convertToEST(minTime),
        max: convertToEST(maxTime),
        dateTimeLabelFormats: {
          millisecond: '%H:%M:%S.%L',
          second: '%H:%M:%S',
          minute: '%H:%M',
          hour: '%H:%M',
          day: '%b %e',
          week: '%b %e',
          month: '%b %Y',
          year: '%Y'
        },
        crosshair: true,
        labels: {
          format: '{value:%H:%M:%S}',
        },
      },
      yAxis: {
        title: {
          text: 'Value',
        },
      },
      tooltip: {
        shared: true,
        xDateFormat: '%Y-%m-%d %H:%M:%S (EST)',
        valueDecimals: 2,
      },
      plotOptions: {
        line: {
          marker: {
            enabled: false,
          },
        },
      },
      series: seriesData,
    };
  }, [producers, minTime, maxTime]);

  return (
    <div className="chart-container">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
