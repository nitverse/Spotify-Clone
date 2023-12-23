"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

import useSubscribeModal from '@/hooks/useSubscribeModal';
import { useUser } from '@/hooks/useUser';
import { postData } from '@/libs/helpers';
import { getStripe } from '@/libs/stripeClient';
import { Price, ProductWithPrice } from '@/types';

import Modal from './Modal';


interface SubscribeModalProps {
  products: ProductWithPrice[];
}

const formatPrice = (price: Price) => {
  const priceString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency,
    minimumFractionDigits: 0
  }).format((price?.unit_amount || 0) / 100);

  return priceString;
};


const SubscribeModal: React.FC<SubscribeModalProps> = ({
  products
}) => {
  const subscribeModal = useSubscribeModal();
  const { user, isLoading, subscription } = useUser();

  const [priceIdLoading,setPriceIdLoading] = useState<string>();

  const onChange = (open: boolean) => {
    if (!open) {
      subscribeModal.onClose();
    }
  }

  const handleButton = async() => {
    console.log('function fucking calleddddddddd');
    
  }
  const handleCheckout = async (price: Price) => {
    console.log('function called');
    console.log(user);
    
    console.log(subscription);
    
    setPriceIdLoading(price.id);
    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error('Must be logged in');
    }

    if (subscription) {
      setPriceIdLoading(undefined);
      return toast('Already subscribed');
    }

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price }
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return toast.error((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  let content = (
    <div className="text-center">
      No products available.
    </div>
  )

  if (products.length) {
    content = (
      <div>
        {products.map((product) => {
          if (!product.prices?.length) {
            return (
              <div key={product.id}>
                No prices available
              </div>
            );
          }

          return product.prices.map((price) => (
            <button 
              key={price.id} 
              onClick={() => handleCheckout(price)}
              disabled={isLoading || price.id === priceIdLoading}
              className="w-full
              rounded-full bg-green-500 border-transparent px-3 py-3
                text-black disabled:cursor-not-allowed disabled:opacity-50
                font-bold hover:opacity-75 transition mb-4"
            >
              {`Subscribe for ${formatPrice(price)}/${price.interval}`}
            </button>
          ))
        })}
      </div>
    )
  }

  if (subscription) {
    content = (
      <div className="text-center">
        Already subscribed.
      </div>
    )
  }

  return (
    <Modal
      title="Only for premium users"
      description="Listen to music with Spotify Premium"
      isOpen={subscribeModal.isOpen}
      onChange={onChange}
    >
      {content}
    </Modal>
  );
}

export default SubscribeModal;