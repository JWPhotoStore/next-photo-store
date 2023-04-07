import "./globals.css";
import Nav from "./components/Nav";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

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
        <Nav user={session?.user} expires={session?.expires as string} />
        {children}
      </body>
    </html>
  );
}
