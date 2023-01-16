import { LoaderFunction } from '@remix-run/node';
import { listItems } from '~/s3.server';
import { getCognitoCredentials } from '~/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const creds = await getCognitoCredentials(request);
    console.log('identityId', creds?.identityId);
    return await listItems(creds);
  } catch (error) {
    console.log(error);
    return {};
  }
};
