import { CFP_ALLOWED_PATHS } from './constants';
import { getCookieKeyValue } from './utils';
import { getTemplate } from './template';

const CFP_PASSWORD = "password";

export async function onRequest(context: {
  request: Request;
  next: () => Promise<Response>;
  // env: { CFP_PASSWORD?: string };
}): Promise<Response> {
  const { request, next } = context;
  const { pathname, searchParams } = new URL(request.url);
  const { error } = Object.fromEntries(searchParams);
  const cookie = request.headers.get('cookie') || '';
  const cookieKeyValue = await getCookieKeyValue(CFP_PASSWORD);

  if (
    cookie.includes(cookieKeyValue) ||
    CFP_ALLOWED_PATHS.includes(pathname) ||
    !CFP_PASSWORD
  ) {
    // Correct hash in cookie, allowed path, or no password set.
    // Continue to next middleware.
    return await next();
  } else {
    // No cookie or incorrect hash in cookie. Redirect to login.
    return new Response(getTemplate({ redirectPath: pathname, withError: error === '1' }), {
      headers: {
        'content-type': 'text/html'
      }
    });
  }
}
