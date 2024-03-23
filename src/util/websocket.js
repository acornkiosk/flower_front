
/** 컴포넌트가 아니기에 useDispatch, useSelector, useRef, useEffect 모두 사용불가 */

export default function Create(ws) {

  /** 최초 연결 후 동작 */
  function connectWebSocket() {
    /** localhost용 요청링크 */
    ws.current = new WebSocket("ws://localhost:9000/flower/ws/owner")
    /** 실제서버용 요청링크 */
    // ws.current = new WebSocket("ws://flower.onleave.co.kr:9000/flower/ws/owner")
    ws.current.onopen = () => { 
      // console.log(socketState(ws.current.readyState))

    }
    ws.current.onerror = (e) => {
      console.log(e)
      console.log(socketState(ws.readyState))
    }
    /** 닫힌 이후의 로직 */
    ws.current.onclose = (e) => {
      /** 웹소켓 종료 이후 서버로부터 전달받은 메시지 */
      if (e.code !== 1000 && !e.wasClean) {
        /** 에러 정보 공유 */
        console.log(e.code, e.reason)
        /** 현재 웹소켓 세션을 제거. */
        ws.current = null;
        /** 새로운 웹소켓 생성 */
        connectWebSocket();
      }
      console.log("끊긴 웹소켓 세션 삭제여부: " + e.wasClean)
    }
    /**
     * WebSocket close 와 onclose 의 차이와 사용법
     * 
     * code : 커넥션을 닫을 때 사용하는 특수 코드
     * reason : 커넥션 닫기 사유를 설명하는 문자열
     *
     * close 
     * 작성법 : WebSocket.close(code, reason);
     * 의미 : 사유를 지정하여 직접 웹소켓 종료시키기
     * 
     * onclose
     * 작성법 : WebSocket.close = () => { 명령할 함수 작성 }
     * 의미 : 종료될 경우 함수 실행
     */
  }
  /** 최초 웹소켓 연결 함수 호출 */
  connectWebSocket();
}
/** 로그아웃시 웹소켓 정상종료 */
function close(ws, msg) {
  /** undefined 에러 방지 */
  if (ws.current) {
    ws.current.close(1000, msg)
    console.log(socketState(ws.current.readyState))
    /*
     * WebSocket.close(code, reason);
     * code : 커넥션을 닫을 때 사용하는 특수 코드
     * reason : 커넥션 닫기 사유를 설명하는 문자열
     */
  }
}
/** kiosk.js 에서 시작하는 키오스크 전원제어 */
function send(ws, msg, list) {
  if (ws.current) {
    list.forEach(id => {
      var info = {
        type: "SET_KIOSK"
        , kioskID: id
        , power: msg
      }
      ws.current.send(JSON.stringify(info))
    });
  }
}
/** 콜백함수를 활용한 Toast 메시지 */
function setToast(ws, callback) {
  if(ws.current == null){Create(ws)}
  if(ws.current){
    ws.current.onmessage = (msg) => {
      /** 알림소리 => 크롬 음악정책 해결할 필요있음 */
      // const dieSound = new Audio("/sounds/DingDong.mp3");
      // dieSound.currentTime = 0;
      // dieSound.play();
      
      let result = JSON.parse(msg.data);
      callback(result)
    }
  }
}

export { close, send, setToast }

/** 웹소켓 커넥트 상태메시지 */
function socketState(msg) {
  // eslint-disable-next-line default-case
  switch (msg) {
    case 0: {
      return "'CONNECTING': 키오스크 웹소켓 연결시도"
    }
    case 1: {
      return "'OPEN': 키오스크 웹소켓 통신시작"
    }
    case 2: {
      return "'CLOSING': 키오스크 웹소켓 커넥션 종료 중"
    }
    case 3: {
      return "'CLOSED': 키오스크 웹소켓 커넥션이 종료됨"
    }
  }
}