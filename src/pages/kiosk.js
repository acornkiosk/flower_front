import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Pagination, Row, Table } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import EmptyText from "../components/error/EmptyText";
import AddModal from "../components/kiosk/AddModal";
import UpdateModal from "../components/kiosk/UpdateModal";
import Error from "./Error";
import { send, setToast } from "../util/websocket";

function Kiosk() {
  // 페이지 정보를 저장하는 state
  const [pageInfo, setpageInfo] = useState({
    list: [], // 키오스크 리스트
    sortBy: null,
    sortOrder: 'asc'
  })
  // 빈 화면 state
  const [isEmpty, setEmpty] = useState(false)
  const [kioskLocation, setKioskLocation] = useState("");
  // 추가모달 state
  const [addModalShow, setAddModalShow] = useState(false)
  // 수정 모달 state
  const [updateModalShow, setUpdateModalShow] = useState(false)
  // 수정 시 data state
  const [data, setData] = useState({})
  // 체크박스 state
  const [checked, setChecked] = useState({})
  // 추가 form
  const [location, setLocation] = useState("")
  // 체크박스(선택된) 키오스크
  const [selectedKiosk, setSelectedKiosk] = useState([])
  // 전체  체크박스 state
  const [allCheck, setAllCheck] = useState(false)
  // 페이징 UI를 만들 때 사용할 배열
  const [pageArray, setPageArray] = useState([])
  const role = useSelector(state => state.role)
  let ws = useSelector(state => state.ws)
  const dispatch = useDispatch()

  // 페이징 UI를 만들 때 사용할 배열을 리턴해주는 함수
  function createArray(start, end) {
    const result = []
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  }
  const refresh = (num) => {
    // table 에 출력할 키오스크 정보를 받아옴
    axios.post("/api/kiosk/page", num, { "headers": { "Content-Type": "application/json" } })
      .then(res => {
        setEmpty(false)
        setpageInfo(res.data)
        const result = createArray(res.data.startPageNum, res.data.endPageNum)
        setPageArray(result)
      })
      .catch(error => {
        setEmpty(true)
        console.log(error)
      })
  }
  // 화면 로딩 시
  useEffect(() => {
    refresh(1)
    /** WebSocket.js */
    setToast(ws, (result) => {
      if (result.type === "SET_TOAST") {
        dispatch({ type: "SET_TOAST", payload: { isToast: true } })
      }
    })
  }, [ws])
  // 체크박스 체크 시 호출 함수
  const handleCheckBoxChange = (e, item) => {
    const isChecked = e.target.checked
    setChecked({
      ...checked,
      [item.id]: isChecked
    })
    if (isChecked) {
      // 체크된 키오스크 저장
      setSelectedKiosk([...selectedKiosk, item])
    } else {
      // 체크된 키오스크에서 삭제
      let newState = selectedKiosk.filter(tmp => tmp.id !== item.id)
      setSelectedKiosk(newState)
    }
  }
  // 전체 체크박스 체크 시 호출 함수
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

  /** 유효성 검사 통과 이후 추가 요청 함수 */
  const addKiosk = (inputValue) => {
    // 키오스크 추가 옵션
    axios.post('/api/kiosk', { location: inputValue })
      .then(res => {
        setAddModalShow(false)
        refresh(1)
      })
      .catch(error => {
        alert("오류입니다.")
      })
  }

  // 수정 요청 함수
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
      /** 이전 정보에서 power 값을 on 으로 최신화시키기 */
      const updatedKiosk = selectedKiosk.map(item => { return { ...item, power: 'on' } })
      /** selectedKiosk 배열에서 power가 'on' 인 항목들만 추출하여 배열로 반환 */
      const powerOnIds = updatedKiosk.filter(item => item.power === 'on').map(item => item.id);
      /** 실제 DB 로 키오스크 전원여부 데이터를 보내는 코드 */
      updatedKiosk.forEach(item => {
        axios.post("/api/kiosk/update", item)
          .then(res => {
            refresh(1)
          })
      })
      /** websocket.js 를 통해 손님 키오스크에 '신호' 보내주기 */
      send(ws, "on", powerOnIds)
      setChecked({})
      setSelectedKiosk([])
      setAllCheck(false)
    } else {
      /** 이전 정보에서 power 값을 off 으로 최신화시키기 */
      const updatedKiosk = selectedKiosk.map(item => { return { ...item, power: 'off' } })
      /** selectedKiosk 배열에서 power가 'off' 인 항목들만 추출하여 배열로 반환 */
      const powerOnIds = updatedKiosk.filter(item => item.power === 'off').map(item => item.id);
      /** 실제 DB 로 키오스크 전원여부 데이터를 보내는 코드 */
      updatedKiosk.forEach(item => {
        axios.post("/api/kiosk/update", item)
          .then(res => {
            refresh(1)
          })
      })
      /** websocket.js 를 통해 손님 키오스크에 '신호' 보내주기 */
      send(ws, "off", powerOnIds)
      setChecked({})
      setSelectedKiosk([])
      setAllCheck(false)
    }
  }
  // 수정 버튼 클릭 함수
  const showUpdateModal = (item) => {
    setUpdateModalShow(true)
    setData({
      id: item.id,
      location: item.location,
      power: item.power
    })
  }
  // input 값 변경시 location 업데이트
  const handleChange = (e) => {
    setLocation(e.target.value)
    setData({
      ...data,
      location: e.target.value
    })
  }
  const handleChange2 = (e) => {
    setKioskLocation(e.target.value);
  };
  const combinedHandleChange = (e) => {
    handleChange(e);
    handleChange2(e);
  };

  const isLocationValid = kioskLocation.trim().length >= 1 && kioskLocation.trim().length <= 20;

  // 삭제 버튼 기능
  const deleteKiosk = () => {
    selectedKiosk.forEach(tmp => {
      axios.post("/api/kiosk/delete", tmp)
        .then(res => {
          // 삭제한 항목을 제외하고 페이지 정보 업데이트
          const updatedList = pageInfo.list.filter(item => item.id !== tmp.id);
          setpageInfo({
            ...pageInfo,
            list: updatedList
          });
          // 모든 항목이 삭제되었는지 확인하여 isEmpty 상태 업데이트
          setEmpty(updatedList.length === 0);
        })
        .catch(error => {
          setEmpty(true)
          console.log(error)
        })
    })
    // 선택된 키오스크 초기화
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
  if (role.includes("4003")) {
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
        <AddModal
          /** 모달을 보여주기 위한 boolean 값 */
          addModalShow={addModalShow}
          /** 모달을 띄우는 처리함수 */
          setAddModalShow={setAddModalShow}
          /** 기존에 등록한 kiosk 정보를 모두 모달로 전달 */
          pageInfo={pageInfo}
          /** 유효성 통과 후 가져온 값을 함수(매개변수)로 전달 */
          addKiosk={addKiosk}
        />
        <UpdateModal addModalShow={addModalShow} updateModalShow={updateModalShow} setUpdateModalShow={setUpdateModalShow} data={data} handleChange={handleChange} updateKiosk={updateKiosk} isLocationValid={isLocationValid} combinedHandleChange={combinedHandleChange} />
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

        {isEmpty ? <EmptyText message={'키오스크가 없습니다.'} /> :
      
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
        }

      </div>
    )
  } else {
    return (
      <Error />
    )
  }
}

export default Kiosk