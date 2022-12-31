import {useFormik} from 'formik';
import * as Yup from 'yup';
import {WarningText} from '../common';

export const CategorySchema = {
   name: Yup.string().required('Vui lòng nhập name category!'),
};

export default function CategoryCreateModal({
   cancel = () => {},
   editingCategory,
   setEditingCategory,
   createAndUpdateNewCategory,
}: any) {
   const initValueForCategory = {
      name: editingCategory?.name || '',
   };

   const formik = useFormik({
      initialValues: initValueForCategory,
      validationSchema: Yup.object(CategorySchema),
      onSubmit: (values) => {
         let category = {
            name: values.name,
            categoryId: editingCategory?._id || null,
         };
         // using for create or update event when image change

         createAndUpdateNewCategory(category);
      },
   });

   return (
      <form autoComplete='off' onSubmit={formik.handleSubmit}>
         <div>
            <input
               name='name'
               type='text'
               value={formik.values.name}
               className='w-full border-2 px-5 py-2 rounded-md'
               onChange={formik.handleChange}
            />

            {formik.errors.name && formik.touched.name && (
               <WarningText warningText={formik.errors.name} />
            )}
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
   );
}
