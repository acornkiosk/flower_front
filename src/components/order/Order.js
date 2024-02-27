import axios from "axios"
import { useEffect, useState } from "react"
import { Button, CloseButton, Col, Container, FloatingLabel, Form, Modal, Row } from "react-bootstrap"
import OrderItem from "./orderItem"

export default function Order() {
  //들어온 주문을 저장
  const [orders, setOrders] = useState({})
  //상세 모달 state
  const [showModal, setShowModal] = useState(false)
  //상세용 데이터
  const [data,setData] = useState([])
  //상세 모달 handle
  //화면 로딩시 
  useEffect(() => {
    //주문 db에 있는 정보 가져오기 
    axios.post("/api/order/list", {})
      .then(res => {
        const orderData = res.data.list
        //order_id를 기준으로 주문들을 묶어서 저장할 객체
        let updatedOrders = {}

        orderData.forEach(order => {
          const orderId = order.order_id
          if (updatedOrders[orderId]) {
            updatedOrders[orderId].push(order)
          } else {
            updatedOrders[orderId] = [order]
          }
        })
        setOrders(updatedOrders)
      }
      )
      .catch(error => console.log(error))
  }, [])
  return (
    <div>
      <h1>주문 관리 페이지 입니다.</h1>
      <div className="album py-5">
        <Container>
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {Object.keys(orders).map(key =>
              <Col key={key} onClick={() => {
                setShowModal(true)
                setData(orders[key])
                }}>
                <OrderItem orders={orders[key]} setOrders={setOrders} list={orders} id={key} />
              </Col>
            )}
          </Row>
        </Container>
      </div>
      <DetailModal show={showModal} data={data} setShowMoadl = {setShowModal} onHide = {() => setShowModal(false)}/>
    </div>
  )
}

function DetailModal(props) {
  console.log(props.data)
  let order_id
  let kiosk_id
  if(props.data.length !== 0){
    order_id = props.data[0].order_id
    kiosk_id = props.data[0].kiosk_id
  }
  
  return (
    <Modal
      show = {props.show}
      size="lg"
      centered
    >
      <Modal.Header className="d-flex">
        <Modal.Title className="flex-fill">
          <Row className="justify-content-between">
            <Col>{order_id}번 주문 내역</Col>
            <Col>키오스크 : {kiosk_id}번</Col>
            <Col className="text-end"><CloseButton onClick={() =>{
              props.setShowMoadl(false)
            }}></CloseButton></Col>
          </Row>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      </Modal.Body>
      <Modal.Footer>
        <Button>완료</Button>
        <Button>주문 취소</Button>
      </Modal.Footer>
    </Modal>
  );
}