import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Pagination, Row, Table } from "react-bootstrap";
import { useSelector } from 'react-redux';
import * as Icon from 'react-bootstrap-icons';
import AddModal from "../components/kiosk/AddModal";
import UpdateModal from "../components/kiosk/UpdateModal";

function Kiosk() {
  //페이지 정보를 저장하는 state
  const [pageInfo, setpageInfo] = useState({
    list: [], //키오스크 리스트
    sortBy: null,
    sortOrder: 'asc'
  })
  //추가모달 state
  const [addModalShow, setAddModalShow] = useState(false)
  //수정 모달 state
  const [updateModalShow, setUpdateModalShow] = useState(false)
  //수정시 data state
  const [data, setData] = useState({})
  //체크박스 state
  const [checked, setChecked] = useState({})
  //추가 form
  const [location, setLocation] = useState("")
  //체크박스(선택된) 키오스크
  const [selectedKiosk, setSelectedKiosk] = useState([])
  //전체  체크박스 state
  const [allCheck, setAllCheck] = useState(false)
  //페이징 UI를 만들때 사용할 배열
  const [pageArray, setPageArray] = useState([])

  /** 이것만 있으면 웹소켓 ID를 유지한 채로 사용가능함! */
  const ws = useSelector((state) => state.ws)
  const connect = () => {
    /** 로그인 이후 사용자가 웹브라우저 새로고침한 이후 */
    if(ws == null){console.log("키오스크 관리 : 웹소켓 정보 => 없음")}
    console.log("키오스크 관리 : 웹소켓 정보")
    console.log(ws)
  }
  const send = () => {
    var info = {type: "SET_KIOSK"}
    ws.send(JSON.stringify(info))
    console.log(info)
  }
  //페이징 UI를 만들때 사용할 배열을 리턴해주는 함수
  function createArray(start, end) {
    const result = []
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  }
  const refresh = (num) => {
    //table에 출력할 키오스크 정보를 받아옴
    axios.post("/api/kiosk/page", num, { "headers": { "Content-Type": "application/json" } })
      .then(res => {
        setpageInfo(res.data)
        const result = createArray(res.data.startPageNum, res.data.endPageNum)
        setPageArray(result)
      })
      .catch(error => console.log(error))
  }
  //화면 로딩시
  useEffect(() => {
    refresh(1)
    connect()
  }, [])

  //체크박스 체크시 호출 함수
  const handleCheckBoxChange = (e, item) => {
    const isChecked = e.target.checked
    setChecked({
      ...checked,
      [item.id]: isChecked
    })
    if (isChecked) {
      //체크된 키오스크 저장
      setSelectedKiosk([...selectedKiosk, item])
    } else {
      //체크된 키오스크에서 삭제
      let newState = selectedKiosk.filter(tmp => tmp.id !== item.id)
      setSelectedKiosk(newState)
    }
  }
  //전체 체크박스 체크시 호출 함수
  const handleAllCheckBox = (e) => {
    const isChecked = e.target.checked
    setAllCheck(isChecked)
    // 체크 상태에 따라 선택된 키오스크 배열 업데이트
    let newSelectedKiosk = []
    if (isChecked) {
      newSelectedKiosk = [...pageInfo.list]
    }
    // checked 상태 업데이트
    const newChecked = {}
    pageInfo.list.forEach(tmp => {
      newChecked[tmp.id] = isChecked
    })
    setChecked(newChecked)
    setSelectedKiosk(newSelectedKiosk)
  }
  //추가 요청 함수
  const addKiosk = () => {
    //키오스크 추가 옵션
    axios.post('/api/kiosk', { location: location })
      .then(res => {
        refresh(1)
        setAddModalShow(false)
      })
      .catch(error => {
        console.log(error)
      })
  }
  //수정 요청 함수
  const updateKiosk = (action) => {
    /** UpdateModal.js 를 통해 키오스크 위치만 수정할 때 */
    if (action === 'location') {
      axios.post('/api/kiosk/update', data)
        .then(res => {
          refresh(1)
          setUpdateModalShow(false)
        })
        .catch(error => {
          console.log(error)
        })
    } else if (action === 'on') {
      const updatedKiosk = selectedKiosk.map(item => { return { ...item, power: 'on' } })
      updatedKiosk.forEach(item => {
        axios.post("/api/kiosk/update", item)
          .then(res => {
            refresh(1)
          })
      })
      /** 웹소켓을 통해 손님 키오스크에 신호 보내주기 */
      send()
      setChecked({})
      setSelectedKiosk([])
      setAllCheck(false)
    } else {
      const updatedKiosk = selectedKiosk.map(item => { return { ...item, power: 'off' } })
      updatedKiosk.forEach(item => {
        axios.post("/api/kiosk/update", item)
          .then(res => {
            refresh(1)
          })
      })
      /** 웹소켓을 통해 손님 키오스크에 신호 보내주기 */
      send()
      setChecked({})
      setSelectedKiosk([])
      setAllCheck(false)
    }
  }
  //수정 버튼 클릭 함수
  const showUpdateModal = (item) => {
    setUpdateModalShow(true)
    setData({
      id: item.id,
      location: item.location,
      power: item.power
    })
  }
  //input 값 변경시 location 업데이트
  const handleChange = (event) => {
    setLocation(event.target.value)
    setData({
      ...data,
      location: event.target.value
    })
  }
  //삭제 버튼 기능
  const deleteKiosk = () => {
    selectedKiosk.forEach(tmp => {
      axios.post("/api/kiosk/delete", tmp)
        .then(res => {
          refresh(1)
        })
        .catch(error => {
          console.log(error)
        })
    })
    //선택된 키오스크 초기화
    setSelectedKiosk([])
  }

  const handleSort = (columnName) => {
    const sortOrder = (columnName === pageInfo.sortBy && pageInfo.sortOrder === 'asc') ? 'desc' : 'asc';
    setpageInfo({
      ...pageInfo,
      sortBy: columnName,
      sortOrder: sortOrder,
      list: [...pageInfo.list.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a[columnName].localeCompare(b[columnName]);
        } else {
          return b[columnName].localeCompare(a[columnName]);
        }
      })],
    });
  };

  return (
    <div>
      <Row className="justify-content-md-center">
        <Col>
          <h1>키오스크 관리</h1>
        </Col>
        <Col md="auto">
          <Button variant="success" className="me-3" onClick={() => { updateKiosk('on') }}>전원 켜기</Button>
          <Button variant="danger" className="me-3" onClick={() => { updateKiosk('off') }}>전원 끄기</Button>
          <Button className="me-3" onClick={() => { setAddModalShow(true) }}>추가하기</Button>
          <Button variant="warning" style={{ color: "white" }} onClick={deleteKiosk}>삭제하기</Button>
        </Col>
      </Row>
      <AddModal addModalShow={addModalShow} setAddModalShow={setAddModalShow} handleChange={handleChange} addKiosk={addKiosk} />
      <UpdateModal updateModalShow={updateModalShow} setUpdateModalShow={setUpdateModalShow} data={data} handleChange={handleChange} updateKiosk={updateKiosk} />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th style={{ width: '1%' }}>
              <Form.Check type={`checkbox`} checked={allCheck} onChange={(e) => { handleAllCheckBox(e) }} />
            </th>
            <th>ID</th>
            <th>Location</th>
            <th>
              Power <Icon.ArrowDownUp onClick={() => handleSort('power')} />
            </th>
          </tr>
        </thead>
        <tbody>
          {pageInfo.list.map(item =>
            <tr key={item.id}>
              <td>
                <Form.Check type={`checkbox`} id={item.id} checked={checked[item.id] || false} onChange={(e) => {
                  handleCheckBoxChange(e, item)
                }} />
              </td>
              <td className="justify-content-md-center">{item.id}</td>
              <td className="justify-content-md-center">{item.location} <Icon.Pencil onClick={() => showUpdateModal(item)} /></td>
              <td>{item.power}</td>
            </tr>
          )}
        </tbody>
      </Table>
      <Pagination>
        <Pagination.Item onClick={() => {
          refresh(pageInfo.startPageNum - 1)
        }} disabled={pageArray[0] === 1}>&laquo;</Pagination.Item>
        {pageArray.map(num =>
          <Pagination.Item onClick={() => {
            refresh(num)
            // setParams({ pageNum: num })
          }} key={num} active={pageInfo.pageNum === num}>{num}</Pagination.Item>
        )}
        <Pagination.Item onClick={() => {
          refresh(pageInfo.endPageNum + 1)
        }} disabled={pageInfo.endPageNum >= pageInfo.totalPageCount}>&raquo;</Pagination.Item>
      </Pagination>
    </div>
  )
}


export default Kiosk