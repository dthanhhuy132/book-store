import atob from 'atob';
import cookie from 'cookie';
import Cookies from 'js-cookie';
import {NextPageContext} from 'next';

export const parseJwt = (token: string) => {
   try {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      let jsonPayload = decodeURIComponent(
         atob(base64)
            .split('')
            .map(function (c) {
               return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
      );

      return JSON.parse(jsonPayload);
   } catch (e) {
      return null;
   }
};
export const getTokenSSRAndCSS = (ctx?: NextPageContext): any => {
   let accessToken = '';
   let userToken = null;

   if (typeof window === 'undefined') {
      // SSR
      const cookieStr = ctx?.req?.headers?.cookie || '';
      accessToken = cookie.parse(cookieStr).accessToken;
      userToken = parseJwt(accessToken);
   } else {
      // CSR

      accessToken = Cookies.get('accessToken') || '';
      userToken = parseJwt(accessToken);
   }

   return [accessToken, userToken];
};

export const getTokenExpireTime = (accessToken: string) => {
   const expireTokenTime = parseJwt(accessToken).exp;

   const currentTime = new Date().getTime() / 1000;

   const expireTokenDay = (expireTokenTime - currentTime) / 60 / 60 / 24;

   return expireTokenDay;
};
