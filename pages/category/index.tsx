import {useRouter} from 'next/router';
import {useEffect} from 'react';

export default function CategoryPage() {
   const router = useRouter();

   useEffect(() => {
      router.push('/shop');
   }, []);
   return <div></div>;
}
