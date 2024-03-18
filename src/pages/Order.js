import axios from "axios"
import { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { useDispatch, useSelector } from 'react-redux'
import EmptyText from "../components/error/EmptyText"
import DetailModal from "../components/order/DetailModal"
import OrderItem from "../components/order/orderItem"
import { create } from "../util/websocket"
import Error from "./Error"

export default function Order() {
  //들어온 주문을 저장
  const [orders, setOrders] = useState({})
  //상세 모달 state
  const [showModal, setShowModal] = useState(false)
  //상세용 데이터
  const [data, setData] = useState([])
  /** 디테일 모달을 통해 정보를 처리했을 경우 */
  const [deleteModal, setDeleteModal] = useState({
    target: 0
  })
  let ws = useSelector(state => state.ws)
  const dispatch = useDispatch()
  // 빈 화면 state
  const [isEmpty, setEmpty] = useState(false)
  /** 화면 접속시 호출 메서드 */
  useEffect(() => {
    refresh()
    if (ws.current == null) {
      create(ws)
    } else {
      ws.current.onmessage = (msg) => {
        if (msg != null) {
          let result = JSON.parse(msg.data)
          if (result.type === "SET_TOAST") {
            dispatch({ type: "SET_TOAST", payload: { isToast: true } })
          }
          
          if (result.type === "UPDATE_ORDERS") {
            refresh()
          }
        }
      }
    }
  }, [])
  const refresh = () => {
    // "order_id==0" : 주문 db 중에서 IS_COMPLETED 가 'false' 인 정보들 전부 가져오기 
    axios.post("/api/order/list", {})
      .then(res => {
        setEmpty(false)
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
        setEmpty(true)
        console.log("주문관리 : 400이 나올 경우 서버 상태와 주문개수 확인")
      })
  }
  const role = useSelector(state => state.role)
  if (role.includes("4004")) {
    return (
      <div>
        <h1>주문 관리</h1>
        <div className="album py-5">
          <Container>
            <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {Object.keys(orders).map(key =>
                <Col key={key}>
                  <OrderItem orders={orders[key]} setOrders={setOrders} list={orders} id={key} setShowModal={setShowModal} setData={setData} deleteModal={deleteModal} />
                </Col>
              )}
            </Row>
          </Container>
        </div>
        {/** 주의 : refresh={refresh()} => 무한요청 원인!! */}
        {isEmpty && <EmptyText message={'주문이 없습니다.'} />}
        <DetailModal show={showModal} data={data} setShowModal={setShowModal} onHide={() => setShowModal(false)} setDeleteModal={setDeleteModal} />
      </div>
    )
  } else {
    return (
      <Error />
    )
  }
}