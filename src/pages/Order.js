import axios from "axios"
import { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { useSelector } from 'react-redux'
import DetailModal from "../components/order/DetailModal"
import OrderItem from "../components/order/orderItem"

export default function Order() {
  //들어온 주문을 저장
  const [orders, setOrders] = useState({})
  //상세 모달 state
  const [showModal, setShowModal] = useState(false)
  //상세용 데이터
  const [data, setData] = useState([])
  /** 웹소켓 참조값을 담을 필드 */
  let ws
  /** index.js 에서 생성한 웹소켓 함수를 이어서 사용하기 위함 */
  ws = useSelector((state) => state.ws)
  const connect = () => {
    /** 로그인 이후 사용자가 웹브라우저 새로고침한 이후 */
    if (ws == null) {
      ws = new WebSocket("ws://localhost:9000/flower/ws/order")
      orderMessage(ws)
    }
    else {
      orderMessage(ws)
    }
  }
  const orderMessage = (socket) => {
    /** 손님 키오스크로부터 정보가 왔는 지 확인한다. */
    socket.onmessage = (msg) => {
      if (msg != null) {
        console.log(msg)
        var result = JSON.parse(msg.data);
        if (result.type === "UPDATE_ORDERS") console.log(result.type)
      } else { console.log(msg) }
    }
  }
  /** 화면 호출시 */
  useEffect(() => {
    connect()
  }, [])

  /** 웹소켓 계획
 * 1. 들어온 주문 개수만큼 sidebar.js 개수 표시
 * 2. 다른 페이지에 있더라도 새로운 주문이 들어올 때마다 알림표시 
 * 3. 주문완료 진행시 손님 키오스크에 알림표시, 번호표기 
 */

  /** 주석처리 사유 : 무한요청 증상 개선 */
  
  // const getOrders=() => {
  //   //주문 db에 있는 정보 가져오기 
  //   axios.post("/api/order/list", {})
  //     .then(res => {
  //       const orderData = res.data.list
  //       //order_id를 기준으로 주문들을 묶어서 저장할 객체
  //       let updatedOrders = {}
  //       orderData.forEach(order => {
  //         const orderId = order.order_id
  //         if (updatedOrders[orderId]) {
  //           /** 동일한 정보가 있는 경우는 덮어쓰기 */
  //           updatedOrders[orderId].push(order)
  //         } else {
  //           /** 새로운 정보는 추가하기 */
  //           updatedOrders[orderId] = [order]
  //         }
  //       })
  //       setOrders(updatedOrders)
  //     })
  //     .catch(error => {
  //       console.log("주문관리 : 400이 나올 경우 서버 상태와 주문개수 확인")
  //       console.log(error)
  //     })
  // }

  // const connect = () => {
  //   /** 웹브라우저 새로고침 이후로 정보를 확인하기 위해 if문 작성 */
  //   if (ws == null || ws === undefined) {
  //     console.log("주문관리 : 웹소켓 정보 => 없음")
  //   } else {
  //     console.log("주문관리 : 웹소켓 정보 => 확인")
  //     /** flower_kiosk 의 Cart.js 에서 주문이 들어왔을 때 동작된다. */
  //     ws.onmessage = (msg) => {
  //       if (msg != null) {
  //         var result = JSON.parse(msg.data);
  //         if (result.type === "UPDATE_ORDERS") getOrders()
  //       } else {
  //         console.log("주문없엉")
  //       }
  //     }
  //   }
  // getOrders={getOrders()} }
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
      <DetailModal show={showModal} data={data} setShowModal={setShowModal} onHide={() => setShowModal(false)} />
    </div>
  )
}