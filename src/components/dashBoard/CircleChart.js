import axios from 'axios';
import React, { PureComponent } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';



const data = [
  { name: '한송이', value: 400 },
  { name: '바구니', value: 300 },
  { name: '꽃다발', value: 300 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <>
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    </>

  );
};


let name="gura"
export default class CircleChart extends PureComponent {
  state={

  }
  constructor(props) {
    super(props)
    this.type = props.type
    this.codeId = props.codeId
    this.dateCode = props.dateCode
  }
  static demoUrl = 'https://codesandbox.io/s/pie-chart-with-customized-label-dlhhj';

  componentDidMount(){
    
    
  }

  refresh = ( codeId,dateCode) => {
    axios.post("/api/order/list", { order_id:-1, dayOfMonth:dateCode, category_id:codeId})
      .then(res => {
        console.log("안뇽안용"+res.data.list)
      })
      .catch(error => {
        const status = error.response.data.status
        if(status === "BAD_REQUEST") {
          console.log("데이터 없음")
          //데이터가 없을때 실행할 로직 
        }
      })
  }

  render() {
    return (
      <ResponsiveContainer width="100%" height="80%">
        <h3>{this.type} 매출</h3>
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
