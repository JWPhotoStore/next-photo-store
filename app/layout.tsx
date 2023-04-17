import "./globals.css";
import Nav from "./components/Nav";
import CartContainer from "./cart/CartContainer";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Providers from "@/app/components/Providers";

export const metadata = {
  title: "JW Photos",
  description: "Online photo store",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <Providers>
          <Nav user={session?.user} expires={session?.expires as string} />
          {/* <CartContainer /> */}
        </Providers>
        <main>{children}</main>
      </body>
    </html>
  );
}
