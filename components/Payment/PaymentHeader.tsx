export default function PaymentTableHeader() {
   return (
      <thead>
         <tr className='uppercase text-left border-b-2 border-slate-400'>
            <th colSpan={2}>
               <span className='font-[900]'>Sản phẩm</span>
            </th>
            <th className='text-right'>
               <span className='font-[900]'>Tạm tính</span>
            </th>
         </tr>
      </thead>
   );
}
