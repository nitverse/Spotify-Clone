"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/hooks/useUser";
import Button from "@/components/Button";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import { postData } from "@/libs/helpers";

const AccountContent = () => {
  const router = useRouter();
  const subscribeModal = useSubscribeModal();
  const { isLoading, subscription, user } = useUser();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [isLoading, user, router]);

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link'
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

  return ( 
    <div className="mb-7 px-6">
      {!subscription && (
        <div className="flex flex-col gap-y-4">
        <p>No active plan.</p>
        <button 
          onClick={subscribeModal.onOpen}
          className=" w-[300px] 
          rounded-full bg-green-500 border-transparent px-3 py-3
            text-black disabled:cursor-not-allowed disabled:opacity-50
            font-bold hover:opacity-75 transition"
        >
          Subscribe
        </button>
      </div>
      )}
      {subscription && (
        <div className="flex flex-col gap-y-4">
          <p>You are currently on the 
            <b> {subscription?.prices?.products?.name} </b> 
            plan.
          </p>
          <button
            disabled={loading || isLoading}
            onClick={redirectToCustomerPortal}
            className="w-[300px]
            rounded-full bg-green-500 border-transparent px-3 py-3
              text-black disabled:cursor-not-allowed disabled:opacity-50
              font-bold hover:opacity-75 transition"
          >
            Open customer portal
          </button>
        </div>
      )}
    </div>
  );
}
 
export default AccountContent;