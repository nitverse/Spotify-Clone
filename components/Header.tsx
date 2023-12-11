"use client";

import { useRouter } from "next/navigation";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: FC<HeaderProps> = ({ children, className }) => {
  const router = useRouter();
  const authModal = useAuthModal();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  const handleLogout = async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
  
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Logged Out");
        // Wait for the sign-out to complete before refreshing
        await router.refresh();
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle other errors if needed
    }
  };

  return (
    <div
      className={twMerge(
        `
     h-fit
     bg-gradient-to-b
     from-violet-800
     p-4
     `,
        className
      )}
    >
      <div
        className={twMerge(`
            w-full
            mb-4
            flex
            items-center
            justify-between
        `)}
      >
        <div
          className="
            hidden
            md:flex
            gap-x-2
            items-center"
        >
          <button
            onClick={() => router.back()}
            className="rounded-full
                 bg-black flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretLeft className="text-white" size={35} />
          </button>
          <button
            onClick={() => router.forward()}
            className="rounded-full
                 bg-black flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretRight className="text-white" size={35} />
          </button>
        </div>
        <div
          className="
            flex md:hidden gap-x-2 items-center
        "
        >
          <button
            className="
                rounded-full
                p-2
                bg-white
                flex
                items-center
                justify-center
                hover:opacity-75
                transition
            "
          >
            <HiHome className="text-black" size={20} />
          </button>

          <button
            className="
                rounded-full
                p-2
                bg-white
                flex
                items-center
                justify-center
                hover:opacity-75
                transition
            "
          >
            <BiSearch className="text-black" size={20} />
          </button>
        </div>

        <div
          className="flex
        justify-between items-center gap-x-4"
        >
          {user ? (
            <div className="flex gap-x-4 items-center">
              <button
                onClick={handleLogout}
                className="bg-white px-6 py-2 w-full
          rounded-full  border-transparent 
            text-black disabled:cursor-not-allowed disabled:opacity-50
            font-bold hover:opacity-75 transition"
              >
                Logout
              </button>
              <button
                onClick={() => router.push("/account")}
                className="bg-white w-full px-4 py-4
                rounded-full border-transparent 
                  text-black disabled:cursor-not-allowed disabled:opacity-50
                  font-bold hover:opacity-75 transition"
              >
                <FaUserAlt />
              </button>
            </div>
          ) : (
            <>
              <div>
                <button
                  onClick={authModal.onOpen}
                  className="
                    bg-transparent 
                    text-neutral-300 
                    font-medium
                  "
                >
                  Sign up
                </button>
              </div>
              <div>
                <button
                  onClick={authModal.onOpen}
                  className="bg-white px-6 py-2 w-full
                  rounded-full bg-green-500 border-transparent px-3 py-3
                    text-black disabled:cursor-not-allowed disabled:opacity-50
                    font-bold hover:opacity-75 transition"
                >
                  Log in
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
