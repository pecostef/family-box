import { LoaderFunction } from '@remix-run/node';

import { useLoaderData } from '@remix-run/react';
import * as auth from '~/auth.server';
import { RemixSession } from '../adapters/RemixSession';

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const session = new RemixSession(request);
    return await auth.authenticate(session);
  } catch (error) {
    console.log(error);
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
