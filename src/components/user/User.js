import axios from 'axios';
import InsertModal from './addUserModal';
import UpdateModal from './updateUserModal';
import DeleteModal from './deleteModal';
import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { PencilSquare } from 'react-bootstrap-icons';

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
      + convertTwoLength(calendar.getMonth() + 1) + '월 '
      + convertTwoLength(calendar.getDate()) + '일'
    return date
  }

  // 월, 일을 두 자리수로 표현하기 위한 함수
  const convertTwoLength = (str) => {
    let tmp = String(str)
    if (tmp.length === 1) {
      return '0' + tmp
    }
    return str
  }

  const refresh = () => {
    axios.post("/api/user/list",{rank : 0})
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
      <h1>직원 관리 페이지 입니다.</h1>
      <div className='d-flex justify-content-end'>
        <Button variant="light" onClick={() => { setInsertShow(true) }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" style={{ cursor: "pointer" }} width={"40"} onClick={() => { setInsertShow(true) }}><path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" /></svg>
        </Button>
      </div>
      <Table striped>
        <thead>
          <tr>
            <th>이름</th>
            <th>직급</th>
            <th>입사일자</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {userList.map(item =>
            <tr key={item.userName}>
              <td className='align-middle'>{item.userName}</td>
              <td className='align-middle'>{convertRank(item.rank)}</td>
              <td className='align-middle'>{converRegDate(item.regdate)}</td>
              <td>
                <Button variant="" onClick={() => {
                  setUpdateShow(true)
                  setSelectedUserId(item.id)
                }} >
                  <PencilSquare />
                </Button>

              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <UpdateModal show={updateShow} onHide={() => { setUpdateShow(false) }} userId={selectedUserId} deleteShow={() => { setDeleteShow(true) }} onUserUpdate={refresh}></UpdateModal>
      <InsertModal show={insertShow} onHide={() => { setInsertShow(false) }} onUserAdded={refresh}></InsertModal>
      <DeleteModal show={deleteShow} onHide={() => { setDeleteShow(false) }} userId={selectedUserId} updateHide={() => { setUpdateShow(false) }} onUserDelete={refresh}></DeleteModal>
    </>
  )
}

export default User