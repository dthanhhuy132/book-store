import {useEffect} from 'react';
import Cookies from 'js-cookie';

import {parseJwt} from '.';
import useGlobalState from '../state';
import {useRouter} from 'next/router';
import isAdmin from './isAdmin';

// Bat buoc dang nhap moi vao chua
// Create Post
function useAuthen() {
   const router = useRouter();
   const [accessToken] = useGlobalState('accessToken');
   const [currentUser] = useGlobalState('currentUser');

   useEffect(() => {
      const userToken = parseJwt(accessToken);
      if (!(userToken && userToken.id && userToken.email)) {
         router.push('/login');
      }
   }, [accessToken]);
}

function useAdminAuthen() {
   const router = useRouter();
   const [accessToken] = useGlobalState('accessToken');
   const token = Cookies.get('accessToken') || accessToken;

   const userToken = parseJwt(token);

   useEffect(() => {
      if (!isAdmin(userToken)) {
         router.push('/');
      }
   }, [accessToken]);
}

// Chua dang nhap moi cho phep vao
// Da dang nhap roi -> Day qua homepage
function useNotAuthen() {
   const router = useRouter();
   const [accessToken] = useGlobalState('accessToken');
   const token = Cookies.get('accessToken') || accessToken;

   useEffect(() => {
      const userToken = parseJwt(accessToken);

      if (!isAdmin(userToken)) {
         router.push('/');
      }
   }, [accessToken]);
}

export {useAuthen, useNotAuthen, useAdminAuthen};

export {};
