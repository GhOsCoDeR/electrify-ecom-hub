
import { ReactNode } from "react";
import WebsiteNavbar from "./WebsiteNavbar";
import WebsiteFooter from "./WebsiteFooter";

interface WebsiteLayoutProps {
  children: ReactNode;
}

const WebsiteLayout = ({ children }: WebsiteLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <WebsiteNavbar />
      <main className="flex-grow">{children}</main>
      <WebsiteFooter />
    </div>
  );
};

export default WebsiteLayout;
