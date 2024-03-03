/** 달력기능 */
import * as React from 'react';
import { Button, Form, Modal, Row, Col, Table } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import InsertModal from './addUserModal';
import UpdateModal from './updateUserModal';


/** 주석처리가 많은 이유 : 달력기능 npm install 오류 확인되어 임시조치 */
function User() {
  const [insertShow, setInsertShow] = useState(false);
  const [updateShow, setUpdateShow] = useState(false);
  const[userList,setUserList] =useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null); // 선택된 사용자의 id를 저장

  useEffect(() => {
    axios.get("/api/user/list")
    .then(res=>{
      setUserList( res.data.list);
      refresh()
    })
    .catch(error=>{
      //console.error('사용자 관리 : 정보 리스트 요청 오류:', error);
    })

  }, [])

  const refresh = () => {
    // 회원 추가 후 사용자 목록 다시 불러오기
    axios.get("/api/user/list")
      .then(res => {
        setUserList(res.data.list);
      })
      .catch(error => {
        console.error(error);
      });
  };
  return (
    <>
      <h1>사용자 관리 페이지 입니다.</h1>
      <Button variant="light" onClick={() => { setInsertShow(true) }}>등록하기</Button>
      <Table striped>
        <thead>
          <tr>
            <th>이름</th>
            <th>직급</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {userList.map(item=>(
            <tr key={item.id}>
              <td>{item.userName}</td>
              <td>{item.rank}</td>
              <td><button  onClick={() => { setUpdateShow(true); setSelectedUserId(item.id);}} >수정</button></td>
            </tr>
          ))}
          <tr>
            <td>오영찬</td>
            <td>사장</td>
            <td><button>관리하기 아이콘</button></td>
          </tr>
        </tbody>
      </Table>
      <UpdateModal  show={updateShow} onHide={() => { setUpdateShow(false) }}  userId={selectedUserId} onUserUpdate={refresh}></UpdateModal>
      <InsertModal show={insertShow} onHide={() => { setInsertShow(false) }} onUserAdded={refresh}></InsertModal> 
    </>
  )
}
export default User




// /** 안내 메시지 모달 */
// function infoModal(props){

// }