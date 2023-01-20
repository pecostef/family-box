import { Form, Link } from '@remix-run/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { LoaderFunction, redirect } from '@remix-run/node';
import { getUserFromSessionStorage } from '~/auth.server';
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserFromSessionStorage(request);
  if (user) {
    return redirect('folders');
  }

  return null;
};

export default function Index() {
  return (
    <main className="w-full ">
      <div
        className="flex-col justify-between h-[100vh] w-full bg-no-repeat px-6 pt-8"
        style={{
          backgroundImage: 'url("images/landing-bg.svg")',
          backgroundSize: '100%',
        }}
      >
        <div className="h-2/3 w-full relative flex-col">
          <img src="images/landing-top-image.svg"></img>
          <div className="mt-4">
            <h3 className="text-sky-900 mb-2">Welcome to</h3>
            <h1 className="text-sky-900 mb-4">Familybox</h1>
            <p className="text-zinc-500 text-bold w-2/3">
              Cloud storage platform for the family to manage family and
              personal data.
            </p>
          </div>
        </div>
        <div className=" h-1/3 w-full flex justify-center">
          <Form>
            <Link
              to="login"
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg"
            >
              Sign in <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </Form>
        </div>
      </div>
    </main>
  );
}
