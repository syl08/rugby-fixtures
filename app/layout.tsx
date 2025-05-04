import type { Metadata } from 'next';
import './globals.css';
import NavBar from './components/NavBar';

export const metadata: Metadata = {
    title: 'Rugby Fixtures App',
    description: 'Upload and search rugby fixtures',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-gray-100">
                <NavBar />
                <main>{children}</main>
            </body>
        </html>
    );
}
