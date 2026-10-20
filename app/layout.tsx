import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title: 'Setu — A little play. A little perspective.', description: 'Anonymous conversation games for South Asian students and parents. Practice honesty, challenge assumptions, and find a little common ground.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
