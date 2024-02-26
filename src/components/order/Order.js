import axios from "axios"
import { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import OrderItem from "./orderItem"

function Order() {
  //들어온 주문을 저장
  const [orders, setOrders] = useState({})

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
              <Col key={key}>
                <OrderItem orders={orders[key]} setOrders={setOrders} list={orders} id={key} />
              </Col>
            )}
          </Row>
        </Container>

      </div>

    </div>
  )
}

export default Order