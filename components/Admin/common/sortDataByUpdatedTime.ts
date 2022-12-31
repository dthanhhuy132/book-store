export default function sortDataByUpdatedTime(arr) {
   return arr.length >= 2
      ? [...arr].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      : arr;
}
