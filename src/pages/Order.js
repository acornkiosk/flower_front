import axios from "axios"
import { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { useSelector, useDispatch } from 'react-redux'
import DetailModal from "../components/order/DetailModal"
import OrderItem from "../components/order/orderItem"
import Error from "./Error"

/** 웹소켓 계획
* 1. 들어온 주문 개수만큼 sidebar.js 개수 표시
* 2. 다른 페이지에 있더라도 새로운 주문이 들어올 때마다 알림표시 
* 3. 주문완료 진행시 손님 키오스크에 알림표시, 번호표기 
*/

export default function Order({isOrdered, setIsOrdered}) {
  
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
  /** 현 화면에서 새로고침시 대응 */
  useEffect(() => {
    refresh()
  }, [isOrdered])

  function refresh(){
    // "order_id==0" : 주문 db 중에서 IS_COMPLETED 가 'false' 인 정보들 전부 가져오기 
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
        /** 함수동작 후 주문알림 초기화 */
        setIsOrdered(false)
      })
      .catch(error => {
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
        <DetailModal show={showModal} data={data} setShowModal={setShowModal} onHide={() => setShowModal(false)} setDeleteModal={setDeleteModal} />
      </div>
    )
  } else {
    return (
      <Error />
    )
  }
}