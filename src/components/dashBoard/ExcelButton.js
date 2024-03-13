import { CSVLink } from "react-csv"

export default function ExcelButton( { orderData } ) {

  const data = orderData ? orderData.map(item => ({
    name: item.menu_name,
    category: item.category_name,
    options: item.options_name,
    price: item.menu_price,
    regdate: item.regdate
  })) : [];

  const headers = [
    { label: "제품명", key: "name" },
    { label: "카테고리", key: "category" },
    { label: "옵션", key: "options" },
    { label: "가격", key: "price" },
    { label: "판매 시간", key: "regdate" }
  ]
  return (
    <>
      <div className="btn-group me-2">
        <CSVLink data={data} headers={headers} filename="매출표.csv" className="hidden" target="_blank">
          <button type="button" className="btn btn-sm btn-outline-secondary">csv 다운로드</button>
        </CSVLink>
      </div>
    </>
  )
}