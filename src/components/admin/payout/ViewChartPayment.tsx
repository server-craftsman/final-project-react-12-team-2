import { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'T1',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'T2',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'T3',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'T4',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'T5',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'T6',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'T7',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },{
    name: 'T8',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },{
    name: 'T9',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },{
    name: 'T10',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },{
    name: 'T11',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },{
    name: 'T12',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  }
];

export default class Example extends PureComponent {
  static demoUrl = 'https://codesandbox.io/p/sandbox/simple-bar-chart-72d7y5';

  render() {
    return (
      <ResponsiveContainer width="94%" height="94%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 10,
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
          <Bar dataKey="pv" fill="blue" activeBar={<Rectangle fill="pink" stroke="blue" />} />
          <Bar dataKey="uv" fill="green" activeBar={<Rectangle fill="gold" stroke="purple" />} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
