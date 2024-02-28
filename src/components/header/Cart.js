import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function Cart() {
  const orders = useSelector(state => state.orders)
  return (
    <>
      <Container className="border border-5 rounded">
        <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          {orders.map(item =>
            <Col>
              {item.menu_name}
            </Col>  
          )}
        </Row>
      </Container>
    </>
  )
}