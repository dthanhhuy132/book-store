import {useEffect} from 'react';

import {useRouter} from 'next/router';

export default function AdminPage() {
   const router = useRouter();
   useEffect(() => {
      router.push('/admin/home');
   }, [router.pathname]);
   return <></>;
}
