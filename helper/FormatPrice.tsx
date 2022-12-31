export default function FormatPrice({price = 0, fontSize = '0.9rem'}: any) {
   return (
      <>
         <span className={`text-[0.9rem] font-bold mr-[2px]`}>₫</span>
         <span className={`text-[${fontSize}] font-bold mr-[2px]`}>
            {price.toLocaleString('en-US')}
         </span>
      </>
   );
}
