import axios from 'axios';
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Loading from '../loading';

/** HTML 본문 : 메뉴관리 전체 */ 
function Main() {

  /** 서버에서 가져온 데이터 배분 배열 변수 */ 
  const [menuList, setMenuList] = useState([]);
  /** 로딩실행 값을 true 로 만들고 끝나면 false 로 변환하기 */
  const [loading, setLoading] = useState(true);

  /** 화면에 접속하자마자 서버로부터 메뉴정보를 모두 가져오는 코드를 작성 */
  useEffect(() => {
    // 데이터를 서버로부터 가져오는 비동기 함수
    const fetchData = async () => {
      try {
        const response = await axios.post("/api/menu/list", {});
        setMenuList(response.data.list); // response.data.list = [{},{},{}...]
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        // 데이터 로딩이 완료되면 로딩 상태를 false로 변경
        setLoading(false);
      }
    };

    // fetchData 함수 호출
    fetchData();
  }, []);

  // 로딩 중일 때 Spinner를 보여줌
  if (loading) {
    return <Loading/>;
  }

  /** 화면 구현 */
  return (
    <div>

      <AddMenuBtn></AddMenuBtn>

      <Table striped="columns">
        <thead>
          <tr>
            <th>카테고리</th>
            <th>상품명</th>
            <th>가격</th>
            <th>수정</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {menuList.map(item => (
            <tr key={item.id}>
              <td>{item.category}</td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td><button>수정</button></td>
              <td><button>삭제</button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

/** 등록 버튼 */
function AddMenuBtn() {
  return (
    <div>
      <addMenuBtn>
        <button>등록하기</button>
      </addMenuBtn>
    </div>
  );
}

export default Main;
