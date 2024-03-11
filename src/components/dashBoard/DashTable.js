import { Dropdown } from "react-bootstrap"

export default function DashTable(props) {
  const { selectedDate, changeDate, selectedCategory, changeCategory, setDateCode, setCategoryCode, orderData } = props
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
        <h2>주문 내역</h2>
        <div className="btn-toolbar mb-2 mb-md-0">
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
      <div className="table-responsive small">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">주문번호</th>
              <th scope="col">카테고리</th>
              <th scope="col">상품명</th>
              <th scope="col">옵션</th>
              <th scope="col">개수</th>
              <th scope="col">가격</th>
              <th scope="col">주문일시</th>
            </tr>
          </thead>
          <tbody>
            {
              orderData.map(item =>
                <tr>
                  <td>{item.order_id}</td>
                  <td>{item.category_name}</td>
                  <td>{item.menu_name}</td>
                  <td>{item.options}</td>
                  <td>{item.menu_count}</td>
                  <td>{item.menu_price}</td>
                  <td>{item.regdate}</td>
                  
                </tr>
              )
            }
          </tbody>
        </table>
      </div >
    </>
  )
}