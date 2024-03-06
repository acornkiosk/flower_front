import Chart from "../components/dashBoard/LineChart";
import Header from "../components/dashBoard/Header";
import CircleChart from "../components/dashBoard/CircleChart";
import { Col, Row } from "react-bootstrap";
import DashTable from "../components/dashBoard/DashTable";

export default function DashBoard() {
  return (
    <>
      <Header />
      <Chart />
      <br />
      <hr />
      <div style={{ width: '100%', height: '50vh' }}>
        <Row>
          <Col>
            <CircleChart type={"카테고리"} />
          </Col>
          <Col>
            <CircleChart type={"한송이"} />
          </Col>
          <Col>
            <CircleChart type={"꽃다발"} />
          </Col>
          <Col>
            <CircleChart type={"바구니"} />
          </Col>
        </Row>
        <hr />
        <DashTable />
      </div>

    </>
  )
}