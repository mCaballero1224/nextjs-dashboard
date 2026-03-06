/* The 'next/font' module downloads font files at build time
 * and hosts them w/ other static assets.
 * This means that no additional network requests are made
 * for fonts when a user visits the app
 */
import { Inter, Lusitana } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });
export const lusitana = Lusitana({
	weight: ['400', '700'],
	subsets: ['latin'],
});
