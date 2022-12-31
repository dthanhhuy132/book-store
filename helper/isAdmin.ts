export default function isAdmin(user) {
   return user?.role === 'admin' || user?.data?.role === 'admin';
}
