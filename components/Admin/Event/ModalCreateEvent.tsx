import {useState, useEffect, useRef} from 'react';

import {WarningText} from '../common';

import {useFormik} from 'formik';
import * as Yup from 'yup';
import moment from 'moment';

export const EventSchema = {
   title: Yup.string().required('Vui lòng nhập title!'),
   startDate: Yup.date().required('Vui lòng nhập start time'),
   endDate: Yup.date()
      .required('Vui lòng nhập end time')
      .when('startDate', (startDate, schema) => startDate && schema.min(startDate)),
   percent: Yup.number().required('vui lòng nhập phần trăm giảm giá cho Event'),
   description: Yup.string().required('Vui lòng nhập description cho Event!'),
   images: Yup.mixed().required('Images is required'),
};

export default function ModalCreateEvent({
   ok = () => {},
   cancel = () => {},
   handleCreateUpdateEvent,
   editingEvent,
}: any) {
   // check user change images or not -> to send formData or just body
   const [isChangeImage, setIsChangeImage] = useState(false);
   //create image
   const [imageFiles, setImageFiles] = useState<any>([]);
   const [imgesURL, setImagesURL] = useState(editingEvent?.images || []);

   const inputFilesRef = useRef(null);

   const createEventForPromoInitValue = {
      title: editingEvent?.title || '',
      startDate: editingEvent?.startDate || '',
      endDate: editingEvent?.endDate || '',
      percent: editingEvent?.percent || 10,
      status: editingEvent?.status || true,
      description: editingEvent?.description || '',
      images: editingEvent?.images || '',
   };

   const formik = useFormik({
      initialValues: createEventForPromoInitValue,
      validationSchema: Yup.object(EventSchema),
      onSubmit: (values) => {
         let event = {
            title: values.title,
            description: values.description,
            startDate: values.startDate,
            endDate: values.endDate,
            status: true,
            percent: 10,
            images: imageFiles,
            id: editingEvent?._id || null,
            isChangeImage: isChangeImage,
         };
         // using for create or update event when image change

         handleCreateUpdateEvent(event);
      },
   });

   // function click upload file

   function handleResetImg() {
      setImageFiles([]);
      setImagesURL([]);

      setIsChangeImage(true);
   }

   function handleUploadImages(e: any) {
      const tempImgFiles = [];
      const tempImgURL = [];
      setIsChangeImage(true);

      [...e.target.files].forEach((file) => {
         tempImgFiles.push(file);
         tempImgURL.push(URL.createObjectURL(file));
      });

      setImageFiles(tempImgFiles);
      setImagesURL(tempImgURL);
   }

   return (
      <div>
         <form autoComplete='off' onSubmit={formik.handleSubmit}>
            <div className='flex flex-col gap-3'>
               {/* event image */}
               <div className='border-[1px] rounded-md relative min-h-[200px]'>
                  {formik.errors.images && formik.touched.images && (
                     <WarningText warningText={formik.errors.images} />
                  )}
                  <>
                     {imgesURL.length > 0 ? (
                        <div className='flex gap-2 w-full p-2 justify-center'>
                           {imgesURL.map((imgURL, index) => (
                              <div key={index}>
                                 <span>{index + 1}</span>
                                 <img src={imgURL} alt='image' className='w-[150px]' />
                              </div>
                           ))}
                        </div>
                     ) : (
                        <button
                           className='absolute p-5 text-[4rem] hover:text-[5rem] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] transition-all'
                           onClick={(e) => {
                              e.preventDefault();
                              inputFilesRef.current.click();
                           }}>
                           +
                        </button>
                     )}
                  </>

                  {/* remove image button */}
                  {imgesURL.length > 0 && (
                     <button
                        className='absolute text-gray-300 hover:text-gray-900 text-[2rem] top-[-10px] right-[10px] transition-all'
                        onClick={() => {
                           handleResetImg();
                           formik.values.images = '';
                        }}>
                        x
                     </button>
                  )}

                  {/* input image */}
                  <input
                     name='images'
                     type='file'
                     accept='image/*'
                     multiple
                     hidden
                     onChange={(e) => {
                        formik.handleChange(e);
                        handleUploadImages(e);
                     }}
                     ref={inputFilesRef}
                  />
               </div>

               {/* event content */}
               <div className='flex flex-col gap-3 w-1/2 mx-auto'>
                  {/* title */}
                  <div>
                     <label htmlFor=''>Title</label>
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

                  {/* description */}
                  <div>
                     <label htmlFor=''>Link liên kết</label>
                     <div className='text-[0.9rem] text-blue-500 italic'>
                        <p>- Link liên kết theo số thứ tự hình</p>
                        <p>- Hình ảnh không có link liên kết Xuống dòng cho hình đó</p>
                        <p>- Số lượng link liên kết phải bằng số lượng hình ảnh</p>
                        <p>- Link hình ảnh: 1. /product/quan-name...</p>
                     </div>
                     <textarea
                        placeholder={`1. /product/ao-quan-136817498849 \n2. /category/quan-nam \n3. /event/...`}
                        rows={3}
                        name='description'
                        className='w-full border-2 px-2 py-1 rounded-md placeholder:text-[0.9rem]'
                        value={formik.values.description}
                        onChange={formik.handleChange}
                     />
                     {formik.errors.description && formik.touched.description && (
                        <WarningText warningText={formik.errors.description} />
                     )}
                  </div>
                  <div className='flex gap-2'>
                     {/* start date*/}
                     <div>
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

                     {/* end date */}
                     <div>
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
                     <div>
                        <label htmlFor=''>Giảm giá cho sự kiện &#40;%&#41;</label>
                        <input
                           type='number'
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
