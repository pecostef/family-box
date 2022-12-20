import { LoaderFunction } from '@remix-run/node';

import { useLoaderData } from '@remix-run/react';
import * as auth from '~/auth.server';
/**
 *
 * @param param0
 * @returns
 */
export const loader: LoaderFunction = async ({ request }) => {
  try {
    return await auth.authenticate(request);
  } catch (error) {
    return {};
  }
};

export function Login() {
  const res = useLoaderData();
  return (
    <>
      <div>{JSON.stringify(res)}</div>
    </>
  );
}

export default Login;
