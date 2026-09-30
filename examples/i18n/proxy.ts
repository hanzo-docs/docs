import { createI18nMiddleware } from '@hanzo/docs/core/i18n/middleware';
import { i18n } from '@/lib/i18n';

export default createI18nMiddleware(i18n);

export const config = {
  // Matcher ignoring `/_next/` and `/v1/`
  // You may need to adjust it to ignore static assets in `/public` folder
  matcher: ['/((?!v1|_next/static|_next/image|favicon.ico).*)'],
};
