export function create(ws) {
  ws.current = new WebSocket("ws://flower.onleave.co.kr:9000/flower/ws/order")
  ws.current.onopen = () => {
    console.log("connected")
  }
  ws.current.onerror = (e) => {
    console.log(e)
  }
  ws.current.onclose = (e) => {
    console.log(e.code, e.reason)
  }
}

export function close(ws, msg) {
  if (ws.current) {
    ws.current.close(1000, msg)
  }
}