import { useSelector } from "react-redux"

//옵션을 글자로 변경
export default function ConvertOptions(options) {
  //공통 코드 가져오기
  const common = useSelector((state) => {
    return state.commonTable
  })
  if (options === null || options === "2019, ") return "옵션 없음"
  const newOptions = options.split(',').map(tmp => parseInt(tmp))
  let result = ""
  for (let item of common) {
    for (let codeId of newOptions) {
      if (codeId === item.code_id) {
        result += (item.code_name + " ").replace(/없음/g, "")
      }
    }
  }

  return result
}