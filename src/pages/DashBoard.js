import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CircleChart from "../components/dashBoard/CircleChart";
import DashTable from "../components/dashBoard/DashTable";
import Header from "../components/dashBoard/Header";
import Chart from "../components/dashBoard/LineChart";
import Error from "./Error";
import { setToast }  from "../util/websocket";


export default function DashBoard() {
  const [selectedDate, setSelectedDate] = useState("오늘")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [categoryCode, setCategoryCode] = useState(0)
  const [dateCode, setDateCode] = useState(1)
  const [orderData, setOrderData] = useState([])
  const [loading, setLoading] = useState(false);
  let ws = useSelector(state => state.ws)
  const dispatch = useDispatch()
  //드롭다운을 누를때 텍스트 변경함수
  function changeDate(text) {
    setSelectedDate(text)
  }
  function changeCategory(text) {
    setSelectedCategory(text)
  }
  const refresh = (dayOfMonth, category_id) => {
    setLoading(true)
    axios.post("/api/order/list", { order_id: -1, dayOfMonth: dayOfMonth, category_id: category_id })
      .then(res => {
        setOrderData(res.data.list)
      })
      .catch(error => {
        const status = error.response.data.status
        if (status === "BAD_REQUEST") {
          setOrderData([])
        }
      })
      .finally(() => {
        // 로딩 상태를 2초 후에 false로 변경
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      });
  }
  useEffect(() => {
    refresh(dateCode, categoryCode)
    /** WebSocket.js */
    setToast(ws,(result)=>{
      if (result.type === "SET_TOAST") {
        dispatch({ type: "SET_TOAST", payload: { isToast: true } })
      }
    })
  }, [dateCode, categoryCode, ws])
  const role = useSelector(state => state.role)
  if (role.includes("4001")) {
    return (
      <>
        <Header selectedDate={selectedDate} orderData={orderData} changeDate={changeDate} setDateCode={setDateCode} setCategoryCode={setCategoryCode} selectedCategory={selectedCategory} changeCategory={changeCategory} />
        {loading ? (

          <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh", marginTop: "73.5px" }}>
            <Image fluid src="/images/loading.gif" style={{ width: "500px" }} />
          </div>

        ) : (
          <>
            <Chart orderData={orderData} dayOfMonth={dateCode} category_id={categoryCode} />

            <br />
            <hr />
            <div style={{ width: '100%', height: '50vh' }}>

              <Row>
                <Col>
                  <CircleChart dayOfMonth={dateCode} categoryCode={0} type={"전체"} />
                </Col>
                <Col>
                  <CircleChart dayOfMonth={dateCode} categoryCode={1001} type={"한송이"} />
                </Col>
                <Col>
                  <CircleChart dayOfMonth={dateCode} categoryCode={1002} type={"꽃다발"} />
                </Col>
                <Col>
                  <CircleChart dayOfMonth={dateCode} categoryCode={1003} type={"바구니"} />
                </Col>
              </Row>
              <hr />

              <DashTable selectedDate={selectedDate} changeDate={changeDate} orderData={orderData} setDateCode={setDateCode} setCategoryCode={setCategoryCode} selectedCategory={selectedCategory} changeCategory={changeCategory} />

            </div>
          </>)}
      </>
    )
  }
  else {
    return (
      <Error />
    )
  }

}