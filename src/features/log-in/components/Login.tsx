import catLogo from '../../../assets/cat_logo.png';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { FaFacebook, FaGoogle } from 'react-icons/fa';

export default function Login() {
  const { t } = useTranslation();

  return (
    <>
      <div className="h-screen bg-white pt-7">
        <div className="flex flex-col justify-center px-6">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="CatMatch"
              src={catLogo}
              className="m-auto h-[120px] w-auto"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">
              {t('log_in_to_your_account')}
            </h2>
          </div>

          <div className="mt-10 rounded-xl bg-[#7289DA] p-8 shadow-2xl sm:mx-auto sm:w-full sm:max-w-sm">
            <form action="#" method="POST">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-black"
                  >
                    {t('email_address')}
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm/6 font-medium text-black"
                    >
                      {t('password')}
                    </label>
                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-semibold text-indigo-400 hover:text-indigo-300"
                      >
                        {t('forgot_password')}
                      </a>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>

              <p className="mt-2 text-end text-sm/6 text-white">
                {t('not_a_member')}{' '}
                <Link
                  to="/register"
                  className="font-semibold text-indigo-900 hover:font-bold hover:text-indigo-700"
                >
                  {t('register')}
                </Link>
              </p>

              <div className="mt-4 space-y-2">
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    {t('sign_in')}
                  </button>
                </div>
                <p className="text-center">or</p>
              </div>

              <div className="mt-3 space-y-2">
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center gap-x-3 rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    <FaFacebook className="size-4 self-center" />
                    {t('log_in_with_facebook')}
                  </button>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center gap-x-3 rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    <FaGoogle className="ml-[-15px] size-4 self-center" />
                    {t('log_in_with_google')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
