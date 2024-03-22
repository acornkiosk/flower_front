import { Dropdown } from "react-bootstrap";
import ExcelButton from "./ExcelButton";


export default function Header(props) {
  const { selectedDate, changeDate, selectedCategory, changeCategory, setDateCode, setCategoryCode,orderData } = props
  //카테고리 가져오기

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h2>대쉬보드</h2>
        <div className="btn-toolbar mb-2 mb-md-0">
          <ExcelButton orderData={orderData} />
          <Dropdown className="me-2">
            <Dropdown.Toggle id="dropdown-autoclose-true" variant="" className="btn-outline-secondary btn-sm gap-1 d-flex align-items-center">
              {selectedCategory}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={(e) => { changeCategory(e.target.innerText); setCategoryCode(0) }}>전체</Dropdown.Item>
              <Dropdown.Item onClick={(e) => { changeCategory(e.target.innerText); setCategoryCode(1001) }}>한송이</Dropdown.Item>
              <Dropdown.Item onClick={(e) => { changeCategory(e.target.innerText); setCategoryCode(1002) }}>꽃다발</Dropdown.Item>
              <Dropdown.Item onClick={(e) => { changeCategory(e.target.innerText); setCategoryCode(1003) }}>바구니</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-autoclose-true" variant="" className="btn-outline-secondary btn-sm gap-1 d-flex align-items-center">
              {selectedDate}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={(e) => { changeDate(e.target.innerText); setDateCode(1) }}>오늘</Dropdown.Item>
              <Dropdown.Item onClick={(e) => { changeDate(e.target.innerText); setDateCode(7) }}>최근 7일</Dropdown.Item>
              <Dropdown.Item onClick={(e) => { changeDate(e.target.innerText); setDateCode(30) }}>최근 30일</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </>
  )
}