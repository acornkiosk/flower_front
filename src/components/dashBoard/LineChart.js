import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    amt: 2100,
  },
];

export default class Example extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/simple-line-chart-kec3v';

  render() {
    return (
      <ResponsiveContainer width="100%" height="50%">
        <h3>매출</h3>
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
