import { useEffect, useState } from "react";
import { Container, Row, Tab, Tabs } from "react-bootstrap";
import { useSelector } from "react-redux";
import Menu from "../../container/Menu";

export default function HeaderMenu() {
  const commonTable = useSelector((state) => state.commonTable)
  const [category, setCategory] = useState([])
  //처음 컴포넌트 실행시 category 가져오기
  useEffect(() => {
    let list = []
    commonTable.forEach(item => {
      if (item.p_code_id === 1000) {
        list.push(item)
      }
    })
    setCategory(list)
  }, [])

  return (
    <div>
      <Tabs defaultActiveKey="All" className="mb-3" fill>
        <Tab eventKey="All" title="All">
          <div className="album py-5 ">
            <Container>
              <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                <Menu category={0} />
              </Row>
            </Container>
          </div>
        </Tab>
        {category.map(item =>
          <Tab eventKey={item.code_id} title={item.code_name}>
            <div className="album py-5 ">
              <Container>
                <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                  <Menu category={item.code_id} />
                </Row>
              </Container>
            </div>
          </Tab>
        )}
      </Tabs>
    </div>

  )
}