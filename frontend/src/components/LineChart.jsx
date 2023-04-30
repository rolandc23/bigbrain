import React from 'react';
import { Line } from 'react-chartjs-2';

/*
LineChart
Handles the creation of the line chart
in the admin results page
*/
function LineChart ({ chartData, title, yAxisTitle, xAxisTitle }) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: 'center' }}>{title}</h2>
      <Line
        data={chartData}
        options={{
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: yAxisTitle
              }
            },
            x: {
              title: {
                display: true,
                text: xAxisTitle
              }
            }
          }
        }
        }
      />
    </div>
  );
}

export default LineChart;
