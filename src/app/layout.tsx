import { Inter } from "next/font/google";
import "./globals.css";
import {ToastContainer} from "react-toastify";
import {Header} from "@/components/header";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='bg-gray-100 font-sans'>
      <body className={`${inter.className}`}>
        <Header />
        <div className='py-10 px-6 text-sm'>
          <ToastContainer autoClose={2000} hideProgressBar={true} />
          {children}
        </div>
      </body>
    </html>
  );
}
