import React, { PureComponent } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default class Example extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/simple-line-chart-kec3v';
  constructor(props) {
    super(props);
    this.state = {
  
      data: []
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.orderData !== prevProps.orderData) {
      console.log(this.state.orderData);
    }
  }
  render() {
    const { orderData, dayOfMonth } = this.props; // 주문 데이터 가져오기
    // 현재 날짜를 기준으로 dayOfMonth에 따른 날짜 배열 생성
    let datesToShow = [];
    const currentDate = new Date();
    switch (dayOfMonth) {
      case 1:
        // 당일 기준 00시를 설정
        const today = new Date(currentDate);

        today.setHours(0, 0, 0, 0); 
        for (let i = 0; i < 24; i++) {
        const date = new Date(currentDate.getTime() - i * 60 * 60 * 1000);
          if (date >= today){ // 00시 보다 큰 data만 출력 , 즉 00시 이후 부터 현재를 기준으로 1시간단위로 확인
              datesToShow.push(date);

          }
        }
        break;
      case 7:
        // 현재 날짜부터 일단위로 7일 간의 날짜 배열 생성
        for (let i = 0; i < 7; i++) {
          const date = new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000);
          datesToShow.push(date);
        }
        break;
      case 30:
        // 현재 날짜부터 30일 전까지의 날짜 배열 생성
        for (let i = 0; i < 30; i++) {
          const date = new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000);
          datesToShow.push(date);
        }
        break;
      default:
        break;
    }
    // 주문 데이터와 매칭되는 날짜의 가격과 수량을 가져와 데이터 배열 생성
    const chartData = datesToShow.map(date => {
      // 해당 날짜에 대한 모든 주문 찾기
      const matchedOrders = orderData.filter(order => {
        const orderDate = new Date(order.regdate);
        if (dayOfMonth === 1) {
          return (
            orderDate.getDate() === date.getDate() &&
            orderDate.getMonth() + 1 === date.getMonth() + 1 &&
            orderDate.getFullYear() === date.getFullYear() &&
            orderDate.getHours() === date.getHours()
          );
        } else {
          return (
            orderDate.getDate() === date.getDate() &&
            orderDate.getMonth() + 1 === date.getMonth() + 1 &&
            orderDate.getFullYear() === date.getFullYear()
          );
        }
      });
      // 해당 날짜의 주문들의 가격과 수량을 곱한 값을 합산
      const totalPrice = matchedOrders.reduce((total, order) => total + (order.total_price * order.menu_count), 0);
      if (dayOfMonth === 1) {
        return {
          name: `${date.getHours()}시`,
          price: totalPrice,
        };
      } else {
        return {
          name: `${date.getMonth() + 1}월 ${date.getDate()}일`,
          price: totalPrice,
        };
      }
    });
    return (
      <ResponsiveContainer width="100%" height="50%">
        <h3>매출</h3>
        <LineChart
          width={500}
          height={300}
          data={chartData.reverse()} // 배열 순서를 뒤집어서 마지막이 현재 날짜가 되도록 함
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value, name, props) => [`${name}: ${value.toLocaleString()}원`, props]} />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
