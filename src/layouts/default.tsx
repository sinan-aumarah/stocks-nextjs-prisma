import { Link } from "@nextui-org/link";
import NextHead from "next/head";
import React from "react";

import { siteConfig } from "@/config/site";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col h-screen">
      <NextHead>
        <title>{siteConfig.name}</title>
        <meta key="title" content={siteConfig.name} property="og:title" />
        <meta content={siteConfig.description} property="og:description" />
        <meta content={siteConfig.description} name="description" />
        <meta
          key="viewport"
          content="viewport-fit=cover, width=device-width,
                   initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          name="viewport"
        />
      </NextHead>
      <main className="container mx-auto max-w-7xl px-6 flex-grow">{children}</main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isBlock
          isExternal
          showAnchorIcon
          className="flex items-center gap-1 text-current"
          color="success"
          href="https://sinanaumarah.com"
          title="Sinan Aumarah 2024"
        >
          © 2024 Sinan Aumarah
        </Link>
      </footer>
    </div>
  );
}
