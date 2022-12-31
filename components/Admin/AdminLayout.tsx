import {useAdminAuthen} from '../../helper/useAuthen';
export default function AdminLayout({children}) {
   useAdminAuthen();

   return <div className='ml-64 p-4'>{children}</div>;
}
