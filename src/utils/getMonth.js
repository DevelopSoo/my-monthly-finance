// "YYYY-MM-DD"에서 MM을 뽑아내는 함수
// ex)
// "2024-01-01" -> 1
// "2024-11-01" -> 11
// "2024-12-01" -> 12
const getMonth = (date) => {
  return new Date(date).getMonth() + 1;
  // 혹은 이렇게 해도 됨
  // return parseInt(date.split("-")[1]);
};

export default getMonth;
