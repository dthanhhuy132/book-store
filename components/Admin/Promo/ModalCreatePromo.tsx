import {useState, useEffect, useRef} from 'react';

import {WarningText} from '../common';
import Cookies from 'js-cookie';

import {useFormik} from 'formik';
import * as Yup from 'yup';
import {validatePromoSchema} from './PromoSchema';

export default function ModalCreatePromo({
   ok = () => {},
   cancel = () => {},
   eventList,
   createUpdatePromo,
}: any) {
   // console.log('evetnlist cho nay la gi', eventList);
   //create image
   const [imageFiles, setImageFiles] = useState<any>([]);
   const [imgesURL, setImagesURL] = useState([]);

   const inputFilesRef = useRef(null);

   const accessToken = Cookies.get('accessToken');

   const createEventForPromoInitValue = {
      name: '',
      description: '',
      categoryImage: '',
      event: [],
   };

   const formik = useFormik({
      initialValues: createEventForPromoInitValue,
      validationSchema: Yup.object(validatePromoSchema),
      onSubmit: (values) => {
         // console.log('values cho nay la gi', values);
         const promo = {
            name: values.name,
            description: values.description,
            eventId: values.event,
            categoryImage: imageFiles[0],
         };
         createUpdatePromo(promo);
      },
   });

   // function click upload file

   function handleResetImg() {
      setImageFiles([]);
      setImagesURL([]);
   }

   function handleUploadImages(e: any) {
      const tempImgFiles = [];
      const tempImgURL = [];

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
            <div className='flex gap-3'>
               <div className='w-1/3 border-[1px] rounded-md relative'>
                  {formik.errors.categoryImage && formik.touched.categoryImage && (
                     <WarningText warningText={formik.errors.categoryImage} />
                  )}
                  <>
                     {imgesURL.length > 0 ? (
                        imgesURL.map((imgURL) => <img src={imgURL} alt='image' key={imgURL} />)
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

                  {imgesURL.length > 0 && (
                     <button
                        className='absolute text-gray-300 hover:text-gray-900 text-[2rem] top-[-10px] right-[10px] transition-all'
                        onClick={() => {
                           handleResetImg();
                           formik.values.categoryImage = '';
                        }}>
                        x
                     </button>
                  )}

                  <div>
                     <input
                        name='categoryImage'
                        type='file'
                        accept='image/*'
                        hidden
                        onChange={(e) => {
                           formik.handleChange(e);
                           handleUploadImages(e);
                        }}
                        ref={inputFilesRef}
                     />
                  </div>
               </div>

               <div className='w-2/3 flex flex-col gap-3'>
                  <div>
                     <label htmlFor=''>Promo name</label>
                     <input
                        name='name'
                        className='w-full border-2 px-2 py-1 rounded-md'
                        value={formik.values.name}
                        onChange={formik.handleChange}
                     />
                     {formik.errors.name && formik.touched.name && (
                        <WarningText warningText={formik.errors.name} />
                     )}
                  </div>

                  <div>
                     <label htmlFor=''>Promo description</label>
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

                  {/* select event for modal */}
                  <div>
                     <p className='font-bold'>Event for promo</p>
                     <div className='flex gap-x-5 flex-wrap'>
                        {eventList.map((item, index) => (
                           <div className='flex items-center gap-1' key={index}>
                              <label htmlFor={index} className='whitespace-nowrap'>
                                 {item.title}
                              </label>
                              <input
                                 name='event'
                                 className='cursor-pointer mt-1'
                                 type='checkbox'
                                 value={item.title}
                                 id={index}
                                 onChange={(e) => {
                                    if (
                                       e.target.checked &&
                                       formik.values.event.indexOf(item._id) < 0
                                    ) {
                                       formik.values.event.push(item._id);
                                    }
                                    if (!e.target.checked) {
                                       formik.values.event = formik.values.event.filter(
                                          (eventItem) => eventItem !== item._id
                                       );
                                    }
                                 }}
                              />
                           </div>
                        ))}
                     </div>
                     {formik.errors.event && formik.touched.event && (
                        <WarningText warningText={formik?.errors.event} />
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
