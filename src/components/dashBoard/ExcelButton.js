import { CSVLink } from "react-csv"

export default function ExcelButton() {
  const headers = [
    { label: "제품명", key: "name" },
    { label: "카테고리", key: "category" },
    { label: "옵션", key: "options" },
    { label: "가격", key: "price" },
    { label: "판매 시간", key: "regdate" }
  ]
  const data = [
    { name: "장미", category: "한송이", options: "투명 포장지, 곰인형", price: "15000", regdate: "2024년 03월 06일 23:53" },
    { name: "장미", category: "한송이", options: "투명 포장지, 곰인형", price: "15000", regdate: "2024년 03월 06일 23:53" },
    { name: "장미", category: "한송이", options: "투명 포장지, 곰인형", price: "15000", regdate: "2024년 03월 06일 23:53" },
    { name: "장미", category: "한송이", options: "투명 포장지, 곰인형", price: "15000", regdate: "2024년 03월 06일 23:53" },
    { name: "장미", category: "한송이", options: "투명 포장지, 곰인형", price: "15000", regdate: "2024년 03월 06일 23:53" }
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