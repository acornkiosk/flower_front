import axios from "axios"
import { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import DetailModal from "../components/order/DetailModal"
import OrderItem from "../components/order/orderItem"
import { useSelector } from 'react-redux';
/** 웹소켓 계획
 * 1. 들어온 주문 개수만큼 sidebar.js 개수 표시
 * 2. 다른 페이지에 있더라도 새로운 주문이 들어올 때마다 알림표시 
 * 3. 키오스크 관리에서 off 하면 '점검중'으로 표기해서 주문이 불가하도록 만들기
 * 4. 주문완료 진행시 손님 키오스크에 알림표시, 번호표기 
 */

export default function Order() {
  //들어온 주문을 저장
  const [orders, setOrders] = useState({})
  //상세 모달 state
  const [showModal, setShowModal] = useState(false)
  //상세용 데이터
  const [data, setData] = useState([])
  /** 이것만 있으면 웹소켓 ID를 유지한 채로 사용가능함! */
  const ws = useSelector((state) => state.ws)

  useEffect(()=>{
    connect()
  })
  const connect = ()=>{
    ws.send("보냄")

  }
  //refresh
  const refresh = () => {

    //주문 db에 있는 정보 가져오기 
    axios.post("/api/order/list", {})
      .then(res => {
        const orderData = res.data.list
        //order_id를 기준으로 주문들을 묶어서 저장할 객체
        let updatedOrders = {}
        orderData.forEach(order => {
          const orderId = order.order_id
          if (updatedOrders[orderId]) {
            /** 동일한 정보가 있는 경우는 덮어쓰기 */
            updatedOrders[orderId].push(order)
          } else {
            /** 새로운 정보는 추가하기 */
            updatedOrders[orderId] = [order]
          }
        })
        setOrders(updatedOrders)
      })
      .catch(error => {
        console.log("주문관리 : 400이 나올 경우 서버 상태와 주문개수 확인")
        console.log(error)
      })
  }
  return (
    <div>
      <h1>주문 관리</h1>
      <div className="album py-5">
        <Container>
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {Object.keys(orders).map(key =>
              <Col key={key}>
                <OrderItem orders={orders[key]} setOrders={setOrders} list={orders} id={key} setShowModal={setShowModal} setData={setData} />
              </Col>
            )}
          </Row>
        </Container>
      </div>
      <DetailModal show={showModal} data={data} setShowModal={setShowModal} refresh={refresh} onHide={() => setShowModal(false)} />
    </div>
  )
}