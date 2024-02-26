import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function OrderItem(props) {
  //공통 코드 가져오기
  const common = useSelector((state)=>{
    return state.commonTable
  })
  const orderId = props.orders[0].order_id
  const kioskId = props.orders[0].kiosk_id
  const regDate = calRegDate(props.orders[0].regdate)
  //주문 시간과 현재시간을 비교
  function calRegDate(regDate) {
    const today = new Date()
    const orderTime = new Date(regDate)
    
    const tTime = today.getTime()
    const oTime = orderTime.getTime()

    const timeDiff = Math.floor(Math.abs(tTime - oTime) / (1000*60))

    return timeDiff
  }
  //옵션을 글자로 변경
  function convertOptions(options) {
    const newOptions = options.split(',').map(tmp => parseInt(tmp))
    let result = ""
    for(let item of common) {
      for(let codeId of newOptions) {
        if(codeId === item.code_id) {
          result += item.code_name + " "
        }
      }
    }

    return result
  }
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Row>
          <Col><Card.Title>주문 번호 : {orderId}번</Card.Title></Col>
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
            <div className="mb-1">
              <Row>
                <Col xs = "auto"><Form.Check type={`checkbox`} /></Col>
                <Col><Card.Text>{item.menu_name}</Card.Text></Col>
                <Col><Card.Text className="text-end">{item.menu_count}개</Card.Text></Col>
              </Row>
              <Row>
                <Col><Card.Text>옵션 : {convertOptions(item.options)}</Card.Text>  </Col>
              </Row>
            </div>
          )}
        </Row>
        <Row className="mt-3">
          <Button>완료</Button>
        </Row>
      </Card.Footer>
    </Card>
  );
};