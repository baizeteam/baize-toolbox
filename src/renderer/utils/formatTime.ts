import dayjs from "dayjs"

// 格式化时间
export function formatTime(time: string | number | Date, format = "YYYY-MM-DD HH:mm") {
  return dayjs(time).format(format)
}
