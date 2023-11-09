"use client";

import AuthModal from "@/components/AuthModal";
import Modal from "@/components/Modal";
import { FC, useState, useEffect } from "react";

interface ModalProviderProps {
 
}

const ModalProvider: FC<ModalProviderProps> = ({  }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AuthModal />
    </>
  );
};

export default ModalProvider;
