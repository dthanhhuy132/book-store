import moment from 'moment';
import {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
import FormatPrice from '../../helper/FormatPrice';
import {getVoucherByCode} from '../../store/voucher/voucherAsyncAction';
import {Loading} from '../common';

export default function PaymentVoucher({
   setVoucher,
   voucher,
   voucherCode,
   setVoucherCode,
   priceWithoutShipCost,
}) {
   const dispatch = useDispatch();
   const [applyVoucher, setApplyVoucher] = useState('');
   const [isShowLoading, setIsShowLoading] = useState(false);

   function handleCheckVoucher() {
      if (!applyVoucher) {
         return;
      } else {
         setIsShowLoading(true);
         dispatch(getVoucherByCode({voucherCode: applyVoucher})).then((res) => {
            if (res.payload.ok) {
               const voucher = res.payload.voucher;
               console.log('voucher la gi', voucher);
               const voucherEndDate = moment(voucher.endDate).format('x');
               const voucherStartDate = moment(voucher.startDate).format('x');
               const dateNow = moment(new Date()).format('x');

               if (Number(voucherStartDate) > Number(dateNow)) {
                  toast.warning('Voucher chưa sẵn sàng');
                  return;
               } else if (Number(voucherEndDate) < Number(dateNow)) {
                  toast.warning('Voucher đã hết hạn sử dụng');
               } else {
                  setVoucher(voucher.percent);
                  setVoucherCode(voucher.code);
               }
               setIsShowLoading(false);

               // if()
            } else {
               toast.warning(`Voucher: ${applyVoucher} không tồn tại`);
               setIsShowLoading(false);
            }
         });
      }
   }

   // reset voucher after delete
   useEffect(() => {
      if (!applyVoucher) {
         setVoucher(0);
         setVoucherCode('');
      }
   }, []);

   return (
      <div className='flex flex-col justify-between mt-4 border-b-[1px] border-slate-400 pb-1'>
         <div className='flex flex-col justify-between'>
            <div className='flex justify-between'>
               <p className='font-bold'>Voucher</p>
               {voucher < 100 ? (
                  <p className='font-extrabold text-[#891a1c]'>-{voucher}%</p>
               ) : (
                  <p className='font-extrabold text-[#891a1c]'>
                     <span className='text-[0.8rem]'>-₫</span>
                     {voucher.toLocaleString('en-US')}
                  </p>
               )}
            </div>

            {voucher <= 100 && voucher != 0 && (
               <div className='flex justify-end'>
                  <p className='font-extrabold text-[#891a1c]'>
                     -<FormatPrice price={(priceWithoutShipCost * voucher) / 100} />
                  </p>
               </div>
            )}
         </div>
         <div className='relative w-full my-2'>
            <input
               type='text'
               className='p-2 w-full rounded-lg outline-none'
               placeholder='Mã giảm giá'
               onChange={(e) => setApplyVoucher(e.target.value)}
            />
            <button
               className={`flex items-center absolute right-0 top-0 h-full px-4 border-[1px] rounded-lg ${
                  applyVoucher ? 'bg-black text-white cursor-pointer' : 'bg-gray-300 cursor-default'
               } `}
               disabled={isShowLoading}
               type='button'
               onClick={handleCheckVoucher}>
               {isShowLoading && <Loading color='white' />}
               Áp dụng
            </button>
         </div>

         <></>
      </div>
   );
}
