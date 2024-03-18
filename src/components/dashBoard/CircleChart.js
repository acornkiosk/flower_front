import axios from 'axios';
import React, { PureComponent } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <>
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}% `}
      </text>
    </>
  );
};
export default class CircleChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dayOfMonth: props.dayOfMonth,
      categoryCode: props.categoryCode,
    };
  }
  componentDidMount() {
    this.fetchData(this.state.dayOfMonth, this.state.categoryCode);
  }
  componentDidUpdate(prevProps) {
    // dayOfMonth prop이 변경되었을 때만 데이터를 다시 가져옴
    if (this.props.dayOfMonth !== prevProps.dayOfMonth) {
      this.fetchData(this.props.dayOfMonth, this.state.categoryCode);
    }
  }
  fetchData(dayOfMonth, categoryCode) {
    // 데이터를 로딩 중임을 표시
    this.setState({ isLoading: true });
    axios.post("/api/order/list", { order_id: -1, dayOfMonth: dayOfMonth, category_id: categoryCode })
      .then(res => {
        const responseData = res.data.list;
        // 중복된 이름을 찾아 가격을 합산하여 새로운 데이터 생성
        const mergedData = this.mergeDuplicateNames(responseData);
        this.setState({ data: mergedData });
      })
      .catch(error => {
        const status = error.response.data.status;
        if (status === "BAD_REQUEST") {
          // 데이터가 없을 때 실행할 로직 
          this.setState({ data: [] });
        }
      });
  }
  // 중복된 이름을 찾아서 가격을 합산하는 함수
  mergeDuplicateNames = (data) => {
    const mergedData = [];
    const nameMap = new Map();
    data.forEach((item) => {
      const { menu_name, total_price } = item;
      if (nameMap.has(menu_name)) {
        // 이미 해당 이름이 있는 경우, 가격을 더해줍니다.
        const index = nameMap.get(menu_name);
        mergedData[index].value += total_price;
      } else {
        // 새로운 이름인 경우, 맵에 이름을 추가하고 데이터를 병합된 데이터 배열에 넣습니다.
        nameMap.set(menu_name, mergedData.length);
        mergedData.push({ name: menu_name, value: total_price });
      }
    });
    return mergedData;
  };
  render() {
    const { data } = this.state;
    return (
      <ResponsiveContainer width="100%" height="80%">
        {data.length > 0 ? (
          <>
            <h3>{this.props.type} 매출</h3>
            <PieChart width={200} height={200}>
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
              <Tooltip formatter={(value, name, props) => [`${name}: ${value.toLocaleString()}원`, props]} />
            </PieChart>
          </>
        ):
        <>
        <h3>{this.props.type} 매출 </h3>
        <div className='d-flex justify-content-center align-items-center' style={{ width:"200px",height:"200px"}}>
          <div className='d-flex justify-content-center align-items-center'
          style={{ 
            width:"160px",
            height:"160px",
            borderRadius:"100px",
            backgroundColor:'#0088FE',
            color:"white"
            }}>
            0%  
          </div>
        </div>
        </>
        }
      </ResponsiveContainer>
    );
  }
}
