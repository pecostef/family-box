import { LoaderFunction } from '@remix-run/node';
import { getIdToken, getUserFromSession } from '../auth.server';
import { CreatePersonalFolderUseCase } from '../di';

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const user = await getUserFromSession(request);
    const err = await CreatePersonalFolderUseCase.execute(user!);
    if (err instanceof Error) {
      return { error: 'could not create personal folder' };
    }
    return await getUserFromSession(request);
  } catch (error) {
    console.log(error);
    return {};
  }
};
