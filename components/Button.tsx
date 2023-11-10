import { FC, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps 
extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement ,ButtonProps> (({
    className,
    children,
    disabled,
    type= "button",
    ...props
} , ref) => {
    return (
        <button
         className={twMerge(`w-full
          rounded-full bg-green-500 border-transparent px-3 py-3
            text-black disabled:cursor-not-allowed disabled:opacity-50
            font-bold hover:opacity-75 transition
          `, className)}
          
          ref={ref}
          >
            {children}
        </button>
    )
}) 

export default Button