import { Button, Col, Row } from "react-bootstrap"
import { DashSquare, PlusSquare, XSquareFill } from "react-bootstrap-icons"

export default function CartRow(props) {
  const {item} = props
  return (
    <>
      <Row className="border-bottom">
        <Col md={1} className="mt-1 md-1">
          <Button variant="secodary"><XSquareFill/></Button>
        </Col>
        <Col md={5} className="mt-1 mb-1 d-flex align-items-center">{item.menu_name} {item.options}</Col>
        <Col md={1} className="mt-1 mb-1 d-flex align-items-center"><Button variant="warning"><PlusSquare/></Button></Col>
        <Col md={1} className="mt-1 mb-1 d-flex align-items-center">{item.menu_count}개</Col>
        <Col md={1} className="mt-1 mb-1 d-flex align-items-center"><Button variant="warning"><DashSquare/></Button></Col>
        <Col md={3} className="mt-1 mb-1 d-flex align-items-center justify-content-end">{item.menu_price * item.menu_count}원</Col>
      </Row>
    </>
  )
}