import { DropdownButton } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';

/** 카테고리 드롭다운 버튼 */
export default function CategoryBtn(props) {

  /** Dropdown.Item 버튼을 눌렀을 때 onClick 함수를 통해 코드값을 이 변수에 전달 */
  const handleDropdownItemClick = (categoryId) => {
    props.onSelectCategory(categoryId);
  };

  return (
    <>
      <categoryBtn>
          <DropdownButton id="dropdown-basic-button" title="항목별 조회">

            {/*메뉴 전체를 불러오기*/}
            <Dropdown.Item value={0} onClick={() => handleDropdownItemClick(0)}>전체</Dropdown.Item>

            {/*항목별 메뉴 불러오기*/}
            {props.list.map(item=>(
              <Dropdown.Item key={item.code_id} value={item.code_id} 
              onClick={() => handleDropdownItemClick(item.code_id)}
              >{item.code_name}</Dropdown.Item>
            ))}

          </DropdownButton>
      </categoryBtn>
    </>
  );
};