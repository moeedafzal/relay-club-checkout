import { Layout, Tooltip } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import styles from "./MainLayout.module.css";
import React from "react";

// Destructuring Layout components from Ant Design.
const { Header, Footer, Content } = Layout;

const MainLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  // Check if the current page is the admin settings page.
  const isAdminSettingPage = router.asPath === "/admin";

  // Function to handle navigation between the admin and checkout pages.
  const handlePageChange = () => {
    if (isAdminSettingPage) {
      router.push("/"); // Navigate to the checkout page.
    } else {
      router.push("/admin"); // Navigate to the admin settings page.
    }
  };

  return (
    <Layout className={styles.layout}>
      {/* Header section with navigation and branding. */}
      <Header className={styles.header}>
        <div onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
          <Image
            alt="Relay Club Logo"
            src="/images/logo.svg"
            width={40}
            height={40}
            className={styles.logoImage}
          />
          Relay Club
        </div>
        <Tooltip
          placement="left"
          title={
            isAdminSettingPage ? "Go to checkout page" : "Go to admin settings"
          }
        >
          <Image
            className={styles.headerImage}
            alt={isAdminSettingPage ? "Checkout Image" : "Admin Settings Image"}
            src={
              isAdminSettingPage ? "/images/checkout.png" : "/images/admin.png"
            }
            width={40}
            height={40}
            onClick={handlePageChange}
          />
        </Tooltip>
      </Header>

      {/* Main content area where child components are rendered. */}
      <Content className={styles.content}>{children}</Content>

      {/* Footer section. */}
      <Footer className={styles.footer}>
        Relay Club ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default MainLayout;
