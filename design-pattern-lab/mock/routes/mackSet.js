// Mock 一個 API 回應
const Random = Mock.Random;

// 自定義生成指定範圍內隨機日期的函式
export const generateRandomDate = (start, end) => {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = Random.integer(startTime, endTime);
  const date = new Date(randomTime);
  return date.toISOString().split('T')[0]; // 返回格式化的日期（YYYY-MM-DD）
};

// 計算今天的前後三個月的日期範圍
export const getThreeMonthRangeFromToday = () => {
  const today = new Date();

  const start = new Date(today);
  start.setMonth(start.getMonth() - 3);

  const end = new Date(today);
  end.setMonth(end.getMonth() + 3);

  return { start, end };
};

//----------Users------------------------------------------
// 隨機生成數據數量（33到50之間）
const userCount = Random.integer(33, 50);

export const generateUsers = () => {
  const { start, end } = getThreeMonthRangeFromToday();

  return Array.from({ length: userCount }, () => ({
    id: Random.id(),
    name: Random.name(),
    age: Random.integer(18, 60),
    email: Random.email(),
    date: generateRandomDate(start, end), // 使用當日前後三個月的隨機日期
  }));
};



//--------------list------------------------------------------
const listCount = Random.integer(23, 60);// 隨機生成數據數量
export const generateList = () => {
  return Array.from({ length: listCount }, (_, index) => ({
    id: Random.id(),
    title: Random.csentence(6, 9),
    ip: Random.ip(),
    // 使用自定義函式生成日期
    date: Random.cparagraph(),
    nb: index + 1, // 新增遞增的編號屬性，從 1 開始
    rating: Random.integer(0, 5),
    imageUrl: `https://picsum.photos/100/100?random=${index}`, // 使用 Picsum 生成圖片
  }));
};

