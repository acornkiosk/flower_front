import axios from 'axios';
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Loading from '../loading';
import CategoryBtn from './categoryBtn';

/** HTML 본문 : 메뉴조회 전체 */ 
function MenuTable() {

  /** 서버에서 가져온 데이터 배분 배열 변수 */ 
  const [menuList, setMenuList] = useState([]);
  /** 로딩실행 값을 true 로 만들고 끝나면 false 로 변환하기 */
  const [loading, setLoading] = useState(true);
  /** 처음 접속시 카테고리 정보를 담는 배분 배열 변수 */
  const [categoryList,setCategoryList] = useState([]);

  /** 화면에 접속하자마자 서버로부터 메뉴정보를 모두 가져오는 코드를 작성 */
  useEffect(() => {
    // 데이터를 서버로부터 가져오는 비동기 함수
    const fetchData = async () => {
      try {
        /** 메뉴정보 전체 요청하기 */
        const menuListResponse = await axios.post("/api/menu/list", {});
        setMenuList(menuListResponse.data.list); // menuListResponse.data.list = [{},{},{}...]
        /** 카테고리 요청하기 */
        const categroyListResponse = await axios.post("/api/common/child"
        ,{
          "code_id": 1000
          ,"p_code_id": 1000
        }
        ,{ headers: { "Content-Type": "application/json" } })
        setCategoryList(categroyListResponse.data.list) // categroyListResponse.data.list = [{},{},{}...]

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

    /** 카테고리 드롭다운 박스에 버튼을 눌렀을 때 그 값을 변수에 담는 함수이자 component 함수 연결고리 */
    const handleCategoryChange = (categoryId) => {
  
      // 로딩 시작
      setLoading(true);
    
      // fetchData 함수 내에서 selectedCategory 값을 직접 사용하지 않고 함수 파라미터로 받도록 수정
      const fetchData = async (category) => {
        try {
          const menuListResponse = await axios.post("/api/menu/list", {
            "category_id": category,
          });
          setMenuList(menuListResponse.data.list);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          // 데이터 로딩이 완료되면 로딩 상태를 false로 변경
          setLoading(false);
        }
      };
    
      // fetchData 함수 호출 시 selectedCategory 값을 전달
      fetchData(categoryId);
    };

  /** 화면 구현 */
  return (
    <div>

      <CategoryBtn list={categoryList} onSelectCategory={handleCategoryChange} />

      <Table striped>
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
              <td><button onClick={()=>{
                
              }}>삭제</button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default MenuTable;
