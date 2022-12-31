export default function productSortSize(sizeAndQuantity) {
   const size = []; // [{S: 12}, ...]
   const sizeArr = ['S', 'M', 'L', 'XL', 'XXL'];

   sizeArr.forEach((item) => {
      if (sizeAndQuantity[item]) {
         size.push({size: item, quantity: sizeAndQuantity[item]});
      }
   });

   return size;
}
