import Chart from "../components/dashBoard/LineChart";
import Header from "../components/dashBoard/Header";
import CircleChart from "../components/dashBoard/CircleChart";
import { Col, Row } from "react-bootstrap";
import DashTable from "../components/dashBoard/DashTable";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashBoard() {
  const [selectedDate, setSelectedDate] = useState("오늘")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [categoryCode,setCategoryCode] =useState(0)
  const [dateCode, setDateCode]= useState(1)
  const [orderData,setorderData]=useState([])
  //드롭다운을 누를때 텍스트 변경함수
  function changeDate(text) {
    setSelectedDate(text)
  }
  function changeCategory(text) {
    setSelectedCategory(text)
  }
  const refresh = ( dayOfMonth,category_id) => {
    axios.post("/api/order/list", { order_id:-1, dayOfMonth:dayOfMonth, category_id:category_id})
      .then(res => {
        console.log(res.data.list)
        setorderData(res.data.list)
      })
      .catch(error => {
        const status = error.response.data.status
        if(status === "BAD_REQUEST") {
          console.log("데이터 없음")
          setorderData([])
        }
      })
  }
  useEffect(() => {
    refresh( dateCode, categoryCode)
  }, [dateCode,categoryCode])
  return (
    <>
      <Header selectedDate = {selectedDate} changeDate={changeDate} setDateCode={setDateCode} setCategoryCode={setCategoryCode} selectedCategory={selectedCategory} changeCategory={changeCategory}/>
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
        <DashTable selectedDate = {selectedDate} changeDate={changeDate} orderData={orderData} setDateCode={setDateCode} setCategoryCode={setCategoryCode} selectedCategory={selectedCategory} changeCategory={changeCategory}/>
      </div>
    </>
  )
}