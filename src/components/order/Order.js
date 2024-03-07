import axios from "axios"
import { useEffect, useState } from "react"
import { Button, CloseButton, Col, Container, Modal, Row } from "react-bootstrap"
import OrderItem from "./orderItem"
import ConvertOptions from "./util"

export default function Order() {
  //들어온 주문을 저장
  const [orders, setOrders] = useState({})
  //상세 모달 state
  const [showModal, setShowModal] = useState(false)
  //상세용 데이터
  const [data, setData] = useState([])
  // 웹소켓 프로토콜을 사용하여 서버 'WebSocketConfig' 연결
  const ws = new WebSocket("ws://localhost:9000/flower/ws/order")

  /** 화면 로딩시  */
  useEffect(() => {
    /** 웹소켓 기능 즉각 실행 */
    connect()
  }, [])

  /** 웹소켓 연결관리 함수 */
  const connect = () => {
    /** 연결에 성공했을 경우 동작하는 메서드 */
    ws.onopen = () => {
      console.log("주문관리 : 실시간 화면연동 시작(웹소켓)")
      refresh()
    }
    /** 연결과정에서 에러가 생겼을 때 동작하는 메서드 */
    ws.onerror = () => { alert("주문관리 : 화면 연동이 원활하게 이루어지지 않고 있습니다. 서버 확인이 필요합니다(웹소켓)") }
    /** 웹소켓에서 메시지 받기 */
    ws.onmessage = (msg) => {
      /** 연습 */
      var newOrder = JSON.parse(msg.data);
      if (newOrder.type === "ORDER_NEW") {
        var time = new Date(newOrder.regdate);
        var info = {
          id: newOrder.id,
          is_completed: newOrder.is_completed,
          kiosk_id: newOrder.kiosk_id,
          menu_count: newOrder.menu_count,
          menu_name: newOrder.menu_name,
          menu_price: newOrder.menu_price,
          options: newOrder.option,
          order_id: newOrder.order_id,
          regdate: time
        };
        console.log("주문관리 : 새로 들어온 주문관리 info")
        console.log(info)
        refresh()
      }
      /** 리팩토링 대상 코드입니다.
       * 현재 : 연습코드는 잘 건너왔는지 확인용도일 뿐 들어오면 refresh 하는 것이 전부
       * 예정1 : 리팩토링한 flower_kiosk 의 Cart.js 부터 건내받은 list 정보로 setOrders() 함수에 담아보자 
       * 예정2 : flower_kiosk 의 Cart.js 에서 건내받은 주문정보 dto를 store 에서 관리하자 */
    }
  }

  //refresh
  const refresh = () => {
    //주문 db에 있는 정보 가져오기 
    axios.post("/api/order/list", {})
      .then(res => {
        const orderData = res.data.list
        //order_id를 기준으로 주문들을 묶어서 저장할 객체
        let updatedOrders = {}
        let count = 0

        orderData.forEach(order => {
          const orderId = order.order_id
          if (updatedOrders[orderId]) {
            /** 동일한 정보가 있는 경우는 덮어쓰기 */
            updatedOrders[orderId].push(order)
          } else {
            /** 새로운 정보는 추가하기 */
            updatedOrders[orderId] = [order]
            /** 주문정보 개수 파악하기 */
            count++
          }
        })
        setOrders(updatedOrders)
        /** 주문개수 전달하기 */
        send(count)
      })
      .catch(error => {
        console.log("주문관리 : 400이 나올 경우 서버 상태와 주문개수 확인")
        console.log(error)
        /** 주문개수 전달하기 */
        send(0)
      })
  }

  /** 웹소켓 전송함수 */
  const send = (count) => {
    let msg = {
      type: "ORDER_COUNT",
      num: count
    }
    /** '사이드바'로 보내기 위함 */
    ws.send(JSON.stringify(msg))
    console.log("주문관리 : 주문정보 " + count + "개 전송됨")
  }

  return (
    <div>
      <h1>주문 관리 페이지 입니다.</h1>
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

function DetailModal(props) {
  let order_id
  let kiosk_id
  if (props.data.length !== 0) {
    order_id = props.data[0].order_id
    kiosk_id = props.data[0].kiosk_id
  }

  //완료버튼을 누를시 
  function onCompleted() {
    for (let item of props.data) {
      item.is_completed = 'true'
      axios.post("/api/order/update", item)
        .then(res => {
          if (res.data.status === 'OK') {
            props.refresh()
          }
        })
        .catch(error => console.log(error))
    }
    props.setShowModal(false)
  }

  //주문취소 버튼을 누를시
  function onDelete() {
    axios.post("/api/order/deleteAll", { order_id: order_id })
      .then(res => {
        if (res.data.status === 'OK') {
          props.refresh()
          props.setShowModal(false)
        }
      })
  }

  return (
    <Modal
      show={props.show}
      size="lg"
      centered
    >
      <Modal.Header className="d-flex">
        <Modal.Title className="flex-fill">
          <Row className="justify-content-between">
            <Col>{order_id}번 주문 내역</Col>
            <Col>키오스크 : {kiosk_id}번</Col>
            <Col className="text-end"><CloseButton onClick={() => {
              props.setShowModal(false)
            }}></CloseButton></Col>
          </Row>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.data.map(item =>
          <>
            <Row className="mb-3 ms-3">
              <Col>
                <Row>{item.menu_name} X {item.menu_count}</Row>
                <Row>{ConvertOptions(item.options)}</Row>
              </Col>
              <Col>주문 시간 : {item.regdate}</Col>
            </Row>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onCompleted}>완료</Button>
        <Button onClick={onDelete}>주문 취소</Button>
      </Modal.Footer>
    </Modal>
  );
}