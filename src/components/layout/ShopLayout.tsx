
import { ReactNode } from "react";
import WebsiteNavbar from "./WebsiteNavbar";
import ShopSidebar from "./ShopSidebar";
import WebsiteFooter from "./WebsiteFooter";

interface ShopLayoutProps {
  children: ReactNode;
}

const ShopLayout = ({ children }: ShopLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <WebsiteNavbar />
      <div className="container mx-auto px-4 flex-grow py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-1/4 lg:w-1/5">
            <ShopSidebar />
          </aside>
          <main className="md:w-3/4 lg:w-4/5">{children}</main>
        </div>
      </div>
      <WebsiteFooter />
    </div>
  );
};

export default ShopLayout;
