import { render, screen } from '@testing-library/react';
import React from 'react';
import LineChart from '../components/LineChart';
import TestRenderer from 'react-test-renderer';
import '@testing-library/jest-dom/extend-expect';

// Nullify chart-js Line element
jest.mock('react-chartjs-2', () => ({
  Line: () => null,
}))

describe('LineChart', () => {
  it('Check linechart', () => {
    // Construct dummy data
    const data = {
      labels: 1,
      datasets: [
        {
          label: 'Test',
          data: 1,
        }
      ]
    }
    render(
      <LineChart chartData={data} title={'Test Title'} yAxisTitle={'TestY'} xAxisTitle={'TestX'} />
    );
    expect(screen.getByText(/Test Title/i)).toBeInTheDocument();

    // Create snapshot of LineChart and confirm it remains consistent with previous tests
    const tree = TestRenderer.create(<LineChart chartData={data} title={'Test Title'} yAxisTitle={'TestY'} xAxisTitle={'TestX'} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
