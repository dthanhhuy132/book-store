export default function handleCategoryDescription(string) {
   if (string && string.indexOf('-category-for-promo') >= 0) {
      const promoIndex = string.indexOf('-category-for-promo');
      return string.slice(0, promoIndex);
   } else {
      return string;
   }
}
