"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Remove unused import
// import { hardhat } from "viem/chains";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { IdeaPulseLogo } from "~~/components/assets/IdeaPulseLogo";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
    icon: <span className="material-icons text-sm align-text-bottom">home</span>,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: <span className="material-icons text-sm align-text-bottom">apps</span>,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <span className="material-icons text-sm align-text-bottom">dashboard</span>,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "font-medium bg-primary/20 text-primary" : ""
              } hover:bg-primary/10 hover:shadow-md focus:!bg-primary/20 active:!text-neutral py-1.5 px-4 text-sm rounded-full gap-2 grid grid-flow-col transition-all duration-200`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  // Remove unused variable or if you need the hook for some reason, keep the hook but not the variable
  const {
    /* targetNetwork */
  } = useTargetNetwork();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "shadow-lg backdrop-blur-lg" : ""
      } bg-indigo-100/90`}
    >
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex justify-between items-center py-3">
          <div className="flex gap-2 sm:gap-4 items-center">
            <div className="dropdown" ref={burgerMenuRef}>
              <label
                tabIndex={0}
                className={`btn btn-ghost btn-sm sm:btn-md btn-circle ${isDrawerOpen ? "hover:bg-primary/20" : "hover:bg-transparent"} lg:hidden`}
                onClick={() => {
                  setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
                }}
              >
                <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </label>
              {isDrawerOpen && (
                <ul
                  tabIndex={0}
                  className="p-2 sm:p-4 mt-3 w-52 sm:w-60 shadow-lg backdrop-blur-lg menu menu-compact dropdown-content bg-indigo-100/90 rounded-box z-[100]"
                  onClick={() => {
                    setIsDrawerOpen(false);
                  }}
                >
                  <HeaderMenuLinks />
                </ul>
              )}
            </div>
            <Link href="/" passHref className="flex gap-2 sm:gap-3 items-center group shrink-0">
              <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <IdeaPulseLogo className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-lg font-bold tracking-wide leading-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  IdeaPulse
                </span>
                <span className="text-[8px] sm:text-xs tracking-widest opacity-75">INNOVATION HUB</span>
              </div>
            </Link>
            <ul className="hidden gap-1 items-center ml-6 lg:flex">
              <HeaderMenuLinks />
            </ul>
          </div>
          <div className="flex gap-2 items-center">
            <RainbowKitCustomConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
};
