import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import ExcelButton from "./ExcelButton";


export default function Header() {
  const [selectedDropDown, setSelectedDropDown] = useState("오늘")
  //드롭다운을 누를때 텍스트 변경함수
  function changeText(text) {
    setSelectedDropDown(text)
  }
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h2>대쉬보드</h2>
        <div className="btn-toolbar mb-2 mb-md-0">
          <ExcelButton/>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-autoclose-true" variant="" className="btn-outline-secondary btn-sm gap-1 d-flex align-items-center">
              {selectedDropDown}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={(e) => { changeText(e.target.innerText) }}>오늘</Dropdown.Item>
              <Dropdown.Item onClick={(e) => { changeText(e.target.innerText) }}>최근 7일</Dropdown.Item>
              <Dropdown.Item onClick={(e) => { changeText(e.target.innerText) }}>최근 30일</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </>
  )
}

