import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';

/** HTML 본문 : 메뉴관리 전체 */ 
function Menu() {

  // 메뉴를 리스트로 요청할 것을 대비한 배분 배열 변수
  const [menuList,setMenuList] = useState([])

  // 메뉴Dto 정보 
  const [menu, setMenu] = useState({
    id: 0,
    name: '',
    img_name: '',
    price: 0,
    summary: '',
    description: '',
    is_sold: '',
    category_id: 0,
    category: '',
    image: ''
  })

  /*
    1. 화면에 접속하자마자 서버로부터 메뉴정보를 모두 가져오는 코드를 작성
      component 가 최초로 실행될 때 호출되는 함수 : useEffect
  */
  useEffect(()=>{
    
  }, [])

  // 2. <Article> 에 props 변수를 이용하여 메뉴 데이터를 전달한다.
  return (
    <div>
      <Header></Header>
      
      <Article></Article>
    </div>
  )
}
/** 헤더 영역 */
function Header(){
  return(
    <header>
      <h1>메뉴 관리 페이지 입니다.</h1>
    </header>
  )
}

/** 아티클 영역 : 화면을 보여주는 역할 */
function Article(props){
  // 3. props 를 매개변수로 받고 값을 menuDto 형태로 분해
  // 4. if문 사용하여 카테고리 선택여부와 데이터 존재 여부에 따라 테이블 정보를 달리 만든다.
  
  return(
    <article>
        <Table striped="columns" border="1">
          <caption>메뉴정보</caption>
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
            
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            
          </tbody>
      </Table>
    </article>
  )
}

export default Menu