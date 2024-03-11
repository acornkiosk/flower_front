import axios from "axios";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Justify } from "react-bootstrap-icons";
import ConvertOptions from "./util";

export default function OrderItem(props) {
  const orderId = props.orders[0].order_id
  const kioskId = props.orders[0].kiosk_id
  const regDate = calRegDate(props.orders[0].regdate)
  //주문 시간과 현재시간을 비교
  function calRegDate(regDate) {
    const today = new Date()
    const orderTime = new Date(regDate)

    const tTime = today.getTime()
    const oTime = orderTime.getTime()

    const timeDiff = Math.floor(Math.abs(tTime - oTime) / (1000 * 60))

    return timeDiff
  }


  //완료 버튼 누를 시 
  function onComplted() {
    let orderList = props.orders
    for (let item of orderList) {
      item.is_completed = 'true'
      axios.post("/api/order/update", item)
        .then(res => {
          if (res.data.status === 'OK') {
            console.log("부자되자!")
            console.log(res.data.status)
            const newList = { ...props.list }
            delete newList[props.id]
            props.setOrders(newList)
          }
        })
        .catch(error => console.log(error))
    }
  }

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Row>
          <Col md={8}><Card.Title>주문 번호 : {orderId}번</Card.Title></Col>
          <Col md={4} className="text-end"><Justify onClick={() => {
                props.setShowModal(true)
                props.setData(props.orders)
              }}></Justify></Col>
        </Row>
        <Row>
          <Col><Card.Title>키오스크 번호 : {kioskId}번</Card.Title></Col>
        </Row>
        <Row>
          <Col><Card.Text className="text-end">{regDate}분 전</Card.Text></Col>
        </Row>
      </Card.Body>
      <Card.Footer>
        <Row className="shadow-sm p-3 rounded" style={{ backgroundColor: '#C7C8CC' }}>
          {props.orders.map(item =>
            <div className="mb-1" key={item.id}>
              <Row>
                <Col xs="auto"><Form.Check type={`checkbox`} /></Col>
                <Col><Card.Text>{item.menu_name}</Card.Text></Col>
                <Col><Card.Text className="text-end">{item.menu_count}개</Card.Text></Col>
              </Row>
              <Row>
                <Col><Card.Text>옵션 : {ConvertOptions(item.options)}</Card.Text>  </Col>
              </Row>
            </div>
          )}
        </Row>
        <Row className="mt-3">
          <Button onClick={onComplted}>완료</Button>
        </Row>
      </Card.Footer>
    </Card>
  );
};