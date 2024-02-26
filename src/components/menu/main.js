import axios from 'axios';
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Loading from '../loading';
import CategoryBtn from './categoryBtn';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

/** HTML 본문 : 메뉴조회 전체 */ 
function Main() {

  /** 로딩실행 값을 true 로 만들고 끝나면 false 로 변환하기 */
  const [loading, setLoading] = useState(true);
  /** 서버에서 가져온 데이터 배분 배열 변수 */ 
  const [menuList, setMenuList] = useState([]);
  /** 필터링된 메뉴 데이터 배열 변수 */
  const [filteredMenuList, setFilteredMenuList] = useState([]);

  const navigate= useNavigate()
  
  /** 화면에 접속하자마자 서버로부터 메뉴정보를 모두 가져오는 코드를 작성 */
  useEffect(() => {
    const fetchData = () =>{

      /** 메뉴정보 전체 요청하기 */
      axios.post("/api/menu/list", {})
      .then(res=>{
        const menuData = res.data.list; // menuListResponse.data.list = [{},{},{}...]
        setMenuList(menuData)
        setFilteredMenuList(menuData)
      })
      .catch(error=>{console.error('Error fetching data:', error);})
      .finally(setLoading(false)) // 데이터 로딩이 완료되면 로딩 상태를 false로 변경
    }
    console.log(menuList)
    // fetchData 함수 호출
    fetchData();
  }, []); // [] 배열 안에 있는 값이 변화를 감지할 때 역시 함수가 호출됨

    /** 카테고리 드롭다운 박스에 버튼을 눌렀을 때 그 값을 변수에 담는 함수이자 component 함수 연결고리 */
    const handleCategoryChange = (item) => {
      try{
        if(item === 1000 || item === 0){

          // 아무 작업 없이 원본 데이터를 그대로 유지
          setFilteredMenuList(menuList);
        }else{
  
          // item.code_id와 일치하는 데이터만을 추려서 새로운 배열 생성
          const filtered = menuList.filter(menu => menu.category_id === item.code_id);
          // 새로운 배열을 상태로 설정
          setFilteredMenuList(filtered);
        }
      }catch (e) {
        console.error('Error handling category change:', e);
      }
      
    };
    
    // 로딩 중일 때 Spinner를 보여줌
    if (loading) {
      return <Loading/>;
    }

  //메뉴 수정 폼으로 가기
  const goToUpdateMenu = (MenuId)=>{
    navigate(`/menu/updateMenu/${MenuId}`)
  }
    
  // 메뉴등록 폼으로가기
    const goToAddMenu = () =>{
      navigate("/menu/addMenu")
  };

  /** 화면 구현 */
  return (
    <div>

      <CategoryBtn onSelectCategory={handleCategoryChange}></CategoryBtn>
      <Button variant="warning" onClick={goToAddMenu}>등록하기</Button>

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
          {filteredMenuList.map(item => (
            <tr key={item.id}>
              <td>{item.category}</td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td><button onClick={()=>goToUpdateMenu(item.id)}>수정</button></td>
              <td><button onClick={()=>{
                
              }}>삭제</button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Main;
