import { Button, Card, Col, Row } from "react-bootstrap"

export default function CartCard(props) {
  const { item } = props
  console.log(item)
  return (
    <>
      <Card className="me-3">
        <Card.Img variant="top" src="/images/header.jpg" style={{ width: "100%" }} />
        <Card.Body>
          <Card.Title>
            {item.menu_name} {item.menu_count}개 {item.options}
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}