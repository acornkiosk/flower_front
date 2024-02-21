import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [common,setCommon] = useState([])
  return (
    <div className="container">
      <h1>인덱스 테스트 페이지 입니다</h1>
      <p>spring boot 와 연동이 되었는지 테스트 입니다.</p>
      <button onClick={() => {
        axios.post("/api/common/child", 1000,
          { headers: { "Content-Type": "application/json" } })
          .then(res => {
            console.log(res.data.list)
            setCommon(res.data.list)
          })
      }}>응답받기</button>
      <table>
        <thead>
          <th>code_id</th>
          <th>p_code_id</th>
          <th>code_name</th>
          <th>code_value</th>
          <th>code_img</th>
        </thead>
        <tbody>
          {common.map(item =>
              <tr>
                <td>{item.code_id}</td>
                <td>{item.p_code_id}</td>
                <td>{item.code_name}</td>
                <td>{item.code_value}</td>
                <td>{item.code_img}</td>
              </tr>
            )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
