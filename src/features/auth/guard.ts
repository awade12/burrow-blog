import 'server-only';
import { redirect } from 'next/navigation';
import { currentUser, type AuthedUser } from './session';
import { loginUserCount } from './users';

// Page-level guard for every admin page except login and setup.
export async function requireAdminPage(): Promise<AuthedUser> {
  if ((await loginUserCount()) === 0) redirect('/admin/setup');
  const user = await currentUser();
  if (!user) redirect('/admin/login');
  return user;
}
