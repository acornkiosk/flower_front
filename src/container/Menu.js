import axios from "axios"
import { useEffect, useState } from "react"
import { Button, Card, Col } from "react-bootstrap"

export default function Menu(props) {
  const { category } = props
  const [menu, setMenu] = useState([])
  //카테고리에 맞는 menu를 출력해쥐야함
  useEffect(() => {
    axios.post("/api/menu/list", { category_id: category })
      .then(res => setMenu(res.data.list))
      .catch(error => console.log(error))
  }, [])
  return (
    <>
      {
      menu.map(item =>
        <Card style={{ width: '18rem' }} className="me-3">
          <Card.Img variant="top" src="/images/header.jpg" style={{width: "100%"}}/>
          <Card.Body>
            <Card.Title>{item.name}</Card.Title>
            <Card.Text>{item.summary}</Card.Text>
            <Card.Text>{item.price}원</Card.Text>
            <Button variant="primary">주문하기</Button>
          </Card.Body>
        </Card>
      )
    }
    </>
    // <Col className="item" style={{ padding: 0 }}>
    //   <div>
    //     <img alt="" style={{ width: "100%" }} />
    //     <h4>
    //       <p>메뉴 이름</p>
    //       <p>메뉴 설명</p>
    //       <p>메뉴 가격</p>
    //     </h4>
    //   </div>
    // </Col>

  )


}