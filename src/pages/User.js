import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Pagination, Table } from 'react-bootstrap';
import { ArrowDown, ArrowDownUp, ArrowUp, PencilFill } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import InsertModal from '../components/user/addUserModal';
import DeleteModal from '../components/user/deleteModal';
import UpdateModal from '../components/user/updateUserModal';
import Error from './Error';
import EmptyText from '../components/error/EmptyText';
import { setToast } from '../util/websocket';

function User() {
  // 빈 화면 state
  const [insertShow, setInsertShow] = useState(false);
  const [updateShow, setUpdateShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null); // 선택된 사용자의 id를 저장
  const commonTable = useSelector(state => state.commonTable)
  const [sort, setSort] = useState("asc")
  const [pageInfo, setPageInfo] = useState({
    list: []
  })
  const role = useSelector(state => state.role)
  // 페이징 UI 를 만들 때 사용할 배열
  const [pageArray, setPageArray] = useState([])
  const dispatch = useDispatch()
  let ws = useSelector(state => state.ws)
  // 페이징 UI 를 만들 때 사용할 배열을 리턴해주는 함수
  function createArray(start, end) {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i)
    }
    return result;
  }
  // rank 를 실제 text 로 변환해주는 함수
  const convertRank = (rank) => {
    for (let item of commonTable) {
      if (item.code_id === rank) {
        return item.code_name
      }
    }
  }
  const convertRole = (role) => {
    const list = role.split(",")
    let result = ""
    for (let item of commonTable) {
      for (let tmp of list) {
        if (item.code_id == tmp) {
          result += item.code_name + " "
        }
      }
    }
    return result
  }
  // regdate를 2024년 03월 03일 형태로 변환해주는 함수 
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
  // 직원 목록 데이터를 읽어오는 함수
  const pageRefresh = (pageNum) => {
    axios.post("/api/user/list", { pageNum: pageNum })
      .then(res => {
        let filterList = res.data.list.filter(item => item.rank !== 3001 && item.rank !== 3002)
        const newResult = {
          ...res.data,
          list: filterList
        }
        setPageInfo(newResult)
        const result = createArray(res.data.startPageNum, res.data.endPageNum)
        setPageArray(result)
      })
      .catch(error => {
        console.log(error)
      })
  }
  // 직원의 입사일자로 정렬할 수 있는 함수
  const handleSortByDate = (sort) => {
    // 입사일자 오름차순, 내림차순으로 정렬함
    axios.post("/api/user/list", { pageNum: 1, sort: sort })
      .then(res => {
        //super와 owner는 없애서 setPageInfo에 넣어야함
        const filterList = res.data.list.filter(item => item.rank !== 3001 && item.rank !== 3002);
        setPageInfo({
          ...res.data,
          list: filterList
        })
      })
      .catch(error => {
        console.log(error)
      })
    if (sort == null) setSort("asc")
    else if (sort === "asc") setSort("desc")
    else if (sort === "desc") setSort(null)
  }
  useEffect(() => {
    pageRefresh(1)
    /** WebSocket.js */
    setToast(ws, (result) => {
      if (result.type === "SET_TOAST") {
        dispatch({ type: "SET_TOAST", payload: { isToast: true } })
      }
    })
  }, [ws])
  if (role.includes("4001")) {
    return (
      <>
        <h1>직원 관리 페이지</h1>
        <div className='d-flex justify-content-end'>
          <Button variant="light" onClick={() => { setInsertShow(true) }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" style={{ cursor: "pointer" }} width={"40"} onClick={() => { setInsertShow(true) }}><path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" /></svg>
          </Button>
        </div>
        <Table striped>
          <thead>
            <tr>
              <th>이름</th>
              <th>아이디</th>
              <th>직급</th>
              <th>접근 권한</th>
              <th>입사일자 <span className='btn' onClick={() => { handleSortByDate(sort) }}>
                {sort == null ?
                  <ArrowDown /> : (
                    sort === "asc" ? <ArrowDownUp />
                      : <ArrowUp />
                  )
                }
              </span></th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {pageInfo.list.map(item =>
              <tr key={item.userName}>
                <td>{item.userName}</td>
                <td>{item.id}</td>
                <td>{convertRank(item.rank)}</td>
                <td>{convertRole(item.role)}</td>
                <td>{converRegDate(item.regdate)}</td>
                <td>
                  <Button className='d-flex justify-content-center' onClick={() => { setUpdateShow(true); setSelectedUserId(item.id); }}>
                    <PencilFill />
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {pageInfo.list.length === 0 ? <EmptyText message={'직원이 없습니다.'} /> :
          <Pagination className="mt-3">
            <Pagination.Item onClick={() => {
              pageRefresh(pageInfo.startPageNum - 1)
            }} disabled={pageArray[0] === 1}>&laquo;</Pagination.Item>
            {
              pageArray.map(item => (<Pagination.Item onClick={() => {
                pageRefresh(item)
              }} key={item} active={pageInfo.pageNum === item}>{item}</Pagination.Item>))
            }
            <Pagination.Item onClick={() => {
              pageRefresh(pageInfo.endPageNum + 1)
            }} disabled={pageInfo.endPageNum >= pageInfo.totalPageCount}>&raquo;</Pagination.Item>
          </Pagination>}
        <UpdateModal show={updateShow} onHide={() => { setUpdateShow(false) }} userId={selectedUserId} deleteShow={() => { setDeleteShow(true) }} onUserUpdate={() => { pageRefresh(1) }}></UpdateModal>
        <InsertModal show={insertShow} onHide={() => { setInsertShow(false) }} pageInfoList={pageInfo.list} onUserAdded={() => { pageRefresh(1) }}></InsertModal>
        <DeleteModal show={deleteShow} onHide={() => { setDeleteShow(false) }} userId={selectedUserId} updateHide={() => { setUpdateShow(false) }} onUserDelete={() => { pageRefresh(1) }}></DeleteModal>
      </>
    )
  }
  else {
    return (
      <Error />
    )
  }
}

export default User