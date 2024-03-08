import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Mon',
    price: 4000,
    amt: 2400,
  },
  {
    name: 'Tue',
    price: 3000,
    amt: 2210,
  },
  {
    name: 'Wed',
    price: 2000,
    amt: 2290,
  },
  {
    name: 'Thu',
    price: 2780,
    amt: 2000,
  },
  {
    name: 'Fri',
    price: 1890,
    amt: 2181,
  },
  {
    name: 'Sat',
    price: 2390,
    amt: 2500,
  },
  {
    name: 'Sun',
    price: 3490,
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
          <Line type="monotone" dataKey="price" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
