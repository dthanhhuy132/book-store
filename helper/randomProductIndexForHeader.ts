export default function randomProductIndexForHeader(length) {
   let arr = [];
   while (arr.length < 8) {
      let r = Math.floor(Math.random() * length - 1) + 1;
      if (arr.indexOf(r) === -1) arr.push(r);
   }
   return arr;
}
