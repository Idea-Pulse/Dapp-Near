import React from "react";
import Link from "next/link";
import { hardhat } from "viem/chains";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { HeartIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

/**
 * Site footer
 */
export const Footer = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div>
        <div className="fixed flex justify-end items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
          <div className={`relative pointer-events-auto group ${isLocalNetwork ? "self-end md:self-auto" : ""}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-accent/40 to-secondary/40 rounded-full blur-md opacity-50 group-hover:opacity-80 transition-all duration-300 animate-pulse"></div>
            <button className="btn bg-gradient-to-r from-accent to-secondary hover:from-secondary hover:to-accent text-white border-none rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium relative z-10 p-0 h-10 min-h-0 overflow-hidden">
              <div className="flex items-center justify-center gap-2 px-4 h-full">
                <ChatBubbleLeftRightIcon className="h-5 w-5 group-hover:animate-bounce flex-shrink-0" />
                <span className="relative inline-block leading-tight text-center">
                  Ask Agent
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/70 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-sm w-full">
            <div className="text-center">
              <Link href="/about" className="link">
                About Us
              </Link>
            </div>
            <span>·</span>
            <div className="flex justify-center items-center gap-2">
              <p className="m-0 text-center">
                Powered by <SparklesIcon className="inline-block h-4 w-4 text-accent" /> IdeaPulse
              </p>
            </div>
            <span>·</span>
            <div className="text-center">
              <Link href="/community" className="link">
                Community
              </Link>
            </div>
            <span>·</span>
            <div className="text-center">
              <Link href="/governance" className="link">
                Governance
              </Link>
            </div>
          </div>
        </ul>
        <div className="text-center mt-2 text-xs opacity-60">
          © {new Date().getFullYear()} IdeaPulse. All rights reserved.
        </div>
      </div>
    </div>
  );
};
