export default function util() {
    //rank를 실제 텍스트로 변환해주는 함수
    const convertRank = (commonTable, rank) => {
        for (let item of commonTable) {
            if (item.code_id === rank) {
                return item.code_name
            }
        }
    }
}