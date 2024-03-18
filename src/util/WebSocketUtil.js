
/** 웹소켓 커넥트 상태메시지 */
function socketState(msg) {
    // eslint-disable-next-line default-case
    switch (msg) {
        case 0: {
            return "'CONNECTING': 손님 키오스크 웹소켓 연결시도"
        }
        case 1: {
            return "'OPEN': 손님 키오스크 웹소켓 통신시작"
        }
        case 2: {
            return "'CLOSING': 손님 키오스크 웹소켓 커넥션 종료 중"
        }
        case 3: {
            return "'CLOSED': 손님 키오스크 웹소켓 커넥션이 종료됨"
        }
    }
}

/** 연속으로 생성되지 않도록 만들기 */
let ws

/** 최초 로그인시 웹소켓 객체 관리 */
export default function WebSocketUtil(event) {
    /** 매개변수 종류 */
    const { power } = event

    ws = new WebSocket("ws://localhost:9000/flower/ws/owner")

    /** 키오스크 전원 on */
    if (power) {
        /** 웹소켓 생성! */
        ws.onopen = () => { console.log(socketState(ws.readyState)) }
        /** 연결 후 사용중에 에러! */
        ws.onerror = (error) => {
            console.log(error)
            console.log(socketState(ws.readyState))
        }
        /** 키오스크 전원 off */
    } else {
        /** 서버로 종료 요청 보내기 */
        ws.onopen = () => {
            /** 연결함수(onopen) 내에서 close 처리를 안하면 에러남 */
            ws.close(1000, "키오스크 전원off");
            console.log(socketState(ws.readyState))
            /*
             * WebSocket.close(code, reason);
             * code : 커넥션을 닫을 때 사용하는 특수 코드
             * reason : 커넥션 닫기 사유를 설명하는 문자열
             */
        }
    }

    /** 영업중에 꺼버림 */
    ws.onmessage = (msg) => {
        var result = JSON.parse(msg.data);
        if (result.type === "UPDATE_ORDERS_TOAST"){
            console.log(result.type)
            //setIsToast(true)
          }else if (result.type === "UPDATE_ORDERS"){   
            console.log(result.type)
            //setIsOrdered(true)
          }
    }
}
function SEND(type) {
    if (type === "SET_KIOSK") {
        var info = { type: "SET_KIOSK" }
        ws.send(JSON.stringify(info))
    }
}




 