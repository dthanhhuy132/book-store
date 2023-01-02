import {useRouter} from 'next/router';
import randomColor from 'randomcolor';
import stringToSlug from '../../helper/stringToSlug';

export default function RenderCategoryItem({categoryName, small = false}) {
   const router = useRouter();
   return (
      <div
         className={`${
            small ? 'px-2 py-2' : 'p-5'
         } text-[1.1rem] font-bold rounded-md text-white cursor-pointer hover:brightness-110`}
         style={{
            backgroundColor: `${randomColor({
               luminosity: 'dark',
               format: 'rgb',
            })}`,
         }}
         onClick={() => router.push(`/category/${stringToSlug(categoryName)}`)}>
         &#35; {categoryName}
      </div>
   );
}
