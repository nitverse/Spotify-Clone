import { create } from 'zustand';

interface SubscribeStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const SubscribeModal = create<SubscribeStore>((set) => ({
  isOpen:true,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default SubscribeModal;