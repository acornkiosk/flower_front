import axios from 'axios';
import InsertModal from './addUserModal';
import UpdateModal from './updateUserModal';
import DeleteModal from './deleteModal';
import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function User() {
  const [insertShow, setInsertShow] = useState(false);
  const [updateShow, setUpdateShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null); // 선택된 사용자의 id를 저장
  // 직원 정보를 저장하는 State
  const [userList, setUserList] = useState([])
  const commonTable = useSelector(state => state.commonTable)

  // rank 를 실제 text 로 변환해주는 함수
  const convertRank = (rank) => {
    for (let item of commonTable) {
      if (item.code_id === rank) {
        return item.code_name
      }
    }
  }

  // regdate를 2024년 03월 03일로 변환해주는 함수 
  const converRegDate = (regdate) => {
    const calendar = new Date(regdate)
    let date = (calendar.getFullYear()) + '년 '  
        + convertTwoLength(calendar.getMonth()+1) + '월 '
        + convertTwoLength(calendar.getDate()) + '일'
    return date
  }

  // 월,일을 두 자리수로 표현하기 위한 함수
  const convertTwoLength = (str) => {
    let tmp = String(str)
    if(tmp.length === 1){
      return '0'+tmp
    }
    return str
  }

  const refresh = () => {
    axios.get("/api/user/list")
      .then(res => {
        let filterList = res.data.list.filter(item => item.rank !== 3001)
        .filter(item => item.rank !== 3002)
        setUserList(filterList)
      })
      .catch(error => console.log(error))
  }

  // 직원 관리 페이지에 들어오면 refresh 함수를 실행시킨다.
  useEffect(() => {
    refresh()
  }, [])

  return (
    <>
      <h1>사용자 관리 페이지 입니다.</h1>
      <Button variant="light" onClick={() => { setInsertShow(true) }}>등록하기</Button>
      <Table striped>
        <thead>
          <tr>
            <th>이름</th>
            <th>직급</th>
            <th>등록일자</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {userList.map(item =>
            <tr key={item.userName}>
              <td>{item.userName}</td>
              <td>{convertRank(item.rank)}</td>
              <td>{converRegDate(item.regdate)}</td>
              <td>
                <Button onClick={() => { setUpdateShow(true); setSelectedUserId(item.id);}}>권한 수정</Button>
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <UpdateModal  show={updateShow} onHide={() => { setUpdateShow(false) }}  userId={selectedUserId} deleteShow={()=>{setDeleteShow(true)}} onUserUpdate={refresh}></UpdateModal>
      <InsertModal show={insertShow} onHide={() => { setInsertShow(false) }} onUserAdded={refresh}></InsertModal> 
      <DeleteModal show={deleteShow} onHide={() => { setDeleteShow(false) }}  userId={selectedUserId} updateHide={()=>{setUpdateShow(false)}} onUserDelete={refresh}  ></DeleteModal> 
    </>
  )
}

export default User