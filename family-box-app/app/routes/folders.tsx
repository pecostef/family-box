import { LoaderFunction } from '@remix-run/node';
import { RemixSession } from '../adapters/RemixSession';
import { getUserFromSession } from '../auth.server';
import { CreatePersonalFolderUseCase } from '../di';

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const session = new RemixSession(request);
    const user = await getUserFromSession(session);
    const err = await CreatePersonalFolderUseCase.execute(user!);
    if (err instanceof Error) {
      return { error: 'could not create personal folder' };
    }
    return { ok: true };
  } catch (error) {
    console.log(error);
    return {};
  }
};
