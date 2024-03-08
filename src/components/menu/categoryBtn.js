import { useEffect, useState } from 'react';
import { DropdownButton } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector } from 'react-redux';

/** 카테고리 드롭다운 버튼 */
export default function CategoryBtn(props) {
  const [categoryList, setCategory] = useState([])
  const [checked, setChecked] = useState({
    title: '전체'
  })




  /** 공통코드에서 카테고리 리스트 별도로 추출 */
  const commonList = useSelector((state) => state.commonTable); // state = {commonTable:[{},{},{}...]}


  /** commonList가 업데이트될 때마다 newArray를 다시 계산하고 categoryList 상태를 업데이트 */
  useEffect(() => {


    try {

      const newArray = commonList.filter(item => item.p_code_id === 1000);
      setCategory(newArray);

    } catch (e) {
      console.error("카테고리 : 공통코드에서 가져온 값 확인 어려움 " + e)
    }



  }, [commonList]);


  /** Dropdown.Item 버튼을 눌렀을 때 onClick 함수를 통해 코드값을 이 변수에 전달 */
  const handleDropdownItemClick = (category) => {
    if (category === 1000 || category === 0) {
      setChecked({
        ...checked,
        title: '전체'
      })
      props.onSelectCategory(category);
    } else {
      setChecked({
        ...checked,
        title: category.code_name
      })
      props.onSelectCategory(category);
    }
  };

  return (
    <>
      <DropdownButton variant='' id="dropdown-basic-button" title={checked.title}>
        {/* 메뉴 전체를 불러오기 */}
        <Dropdown.Item onClick={() => handleDropdownItemClick(0)}>전체</Dropdown.Item>
        {/*항목별 메뉴 불러오기*/}
        {categoryList.map(item => (
          <Dropdown.Item key={item.code_id} onClick={() => handleDropdownItemClick(item)}>
            {item.code_name}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </>
  );
};
