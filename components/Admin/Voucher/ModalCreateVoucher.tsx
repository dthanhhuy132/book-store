import {useState, useEffect, useRef} from 'react';

import {WarningText} from '../common';

import {useFormik} from 'formik';
import * as Yup from 'yup';
import {validateVoucherSchema} from './VoucherSchema';
import voucherApi from '../../../service/voucherApi';

import Cookies from 'js-cookie';
import moment from 'moment';
const accessToken = Cookies.get('accessToken');

export default function ModalCreateVoucher({
   ok = () => {},
   cancel = () => {},
   handleCreateUpdateVoucher,
   edittingVoucher,
}: any) {
   // console.log('evetnlist cho nay la gi', eventList);
   //create image

   const createInitValueForVoucher = {
      title: edittingVoucher?.title || '',
      description: edittingVoucher?.description || '',
      startDate: edittingVoucher?.startDate || '',
      endDate: edittingVoucher?.endDate || '',
      percent: edittingVoucher?.percent || 10,
      code: edittingVoucher?.code || '',
      amount: edittingVoucher?.amount || 10,
   };

   const formik = useFormik({
      initialValues: createInitValueForVoucher,
      validationSchema: Yup.object(validateVoucherSchema),
      onSubmit: (values) => {
         const voucher = {
            title: values.title,
            description: values.description,
            startDate: values.startDate,
            endDate: values.endDate,
            percent: values.percent,
            code: values.code,
            amount: values.amount,
            id: edittingVoucher?._id,
         };
         handleCreateUpdateVoucher(voucher);
      },
   });

   // function click upload file

   return (
      <div>
         <form autoComplete='off' onSubmit={formik.handleSubmit}>
            <div className=' flex flex-col gap-3'>
               {/* 1. title */}
               <div className='flex gap-2'>
                  <div className='w-[50%]'>
                     <label htmlFor=''>Voucher title</label>
                     <input
                        name='title'
                        className='w-full border-2 px-2 py-1 rounded-md'
                        value={formik.values.title}
                        onChange={formik.handleChange}
                     />
                     {formik.errors.title && formik.touched.title && (
                        <WarningText warningText={formik.errors.title} />
                     )}
                  </div>

                  <div className='w-[50%]'>
                     <label htmlFor=''>Voucher amount</label>
                     <input
                        name='amount'
                        className='w-full border-2 px-2 py-1 rounded-md'
                        value={formik.values.amount}
                        onChange={formik.handleChange}
                     />
                     {formik.errors.amount && formik.touched.amount && (
                        <WarningText warningText={formik.errors.amount} />
                     )}
                  </div>
               </div>

               {/* 1. description */}
               <div>
                  <label htmlFor=''>Voucher Description</label>
                  <textarea
                     name='description'
                     className='w-full border-2 px-2 py-1 rounded-md'
                     value={formik.values.description}
                     onChange={formik.handleChange}
                  />
                  {formik.errors.description && formik.touched.description && (
                     <WarningText warningText={formik.errors.description} />
                  )}
               </div>

               {/* 2. voucher code _ % giảm */}
               <div className='flex gap-2'>
                  <div className='w-[50%]'>
                     <label htmlFor=''>Voucher CODE</label>
                     <input
                        name='code'
                        className='w-full border-2 px-2 py-1 rounded-md'
                        value={formik.values.code}
                        onChange={formik.handleChange}
                     />
                     {formik.errors.code && formik.touched.code && (
                        <WarningText warningText={formik.errors.code} />
                     )}
                  </div>
                  {/*4. percent */}
                  <div className='w-[50%]'>
                     <label htmlFor=''>Phần trăm giả giá (%)</label>
                     <input
                        name='percent'
                        className='w-full border-2 px-2 py-1 rounded-md'
                        value={formik.values.percent}
                        onChange={formik.handleChange}
                     />
                     {formik.errors.percent && formik.touched.percent && (
                        <WarningText warningText={formik.errors.percent} />
                     )}
                  </div>
               </div>

               {/* 5. start date */}
               <div className='flex gap-2'>
                  <div className='w-[50%]'>
                     <label htmlFor=''>Start date</label>
                     <input
                        name='startDate'
                        className='w-full border-2 px-2 py-1 rounded-md'
                        type='date'
                        value={
                           formik.values.startDate
                              ? moment(formik.values.startDate).format('YYYY-MM-DD')
                              : ''
                        }
                        onChange={formik.handleChange}
                     />

                     {formik.errors.startDate && formik.touched.startDate && (
                        <WarningText warningText={formik.errors.startDate} />
                     )}
                  </div>

                  {/* 6. end date */}
                  <div className='w-[50%]'>
                     <label htmlFor=''>End date</label>
                     <input
                        name='endDate'
                        className='w-full border-2 px-2 py-1 rounded-md'
                        type='date'
                        value={
                           formik.values.endDate
                              ? moment(formik.values.endDate).format('YYYY-MM-DD')
                              : ''
                        }
                        onChange={formik.handleChange}
                     />

                     {formik.errors.endDate && formik.touched.endDate && (
                        <WarningText warningText={formik.errors.endDate} />
                     )}
                  </div>
               </div>
            </div>
            <div className='flex gap-2 justify-center my-2 border-t-2 pt-2'>
               <button
                  type='submit'
                  className='bg-black hover:bg-[green] min-w-[100px] py-2 rounded-lg text-white'>
                  ok
               </button>
               <button
                  className='hover:bg-[#891a1c] bg-black min-w-[100px] py-2 rounded-lg text-white'
                  onClick={cancel}>
                  cancel
               </button>
            </div>
         </form>
      </div>
   );
}
