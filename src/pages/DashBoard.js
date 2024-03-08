import Chart from "../components/dashBoard/LineChart";
import Header from "../components/dashBoard/Header";
import CircleChart from "../components/dashBoard/CircleChart";
import { Col, Row } from "react-bootstrap";
import DashTable from "../components/dashBoard/DashTable";
import { useState } from "react";

export default function DashBoard() {
  const [selectedDate, setSelectedDate] = useState("오늘")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  //드롭다운을 누를때 텍스트 변경함수
  function changeDate(text) {
    setSelectedDate(text)
  }
  function changeCategory(text) {
    setSelectedCategory(text)
  }
  return (
    <>
      <Header selectedDate = {selectedDate} changeDate={changeDate} selectedCategory={selectedCategory} changeCategory={changeCategory}/>
      <Chart />
      <br />
      <hr />
      <div style={{ width: '100%', height: '50vh' }}>
        <Row>
          <Col>
            <CircleChart type={"카테고리"} />
          </Col>
          <Col>
            <CircleChart type={"한송이"} />
          </Col>
          <Col>
            <CircleChart type={"꽃다발"} />
          </Col>
          <Col>
            <CircleChart type={"바구니"} />
          </Col>
        </Row>
        <hr />
        <DashTable selectedDate = {selectedDate} changeDate={changeDate} selectedCategory={selectedCategory} changeCategory={changeCategory}/>
      </div>

    </>
  )
}