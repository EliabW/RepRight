import * as React from "react";
import { cn } from "@/lib/utils";

interface FancyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  showIcon?: boolean;
}

const FancyButton = React.forwardRef<HTMLButtonElement, FancyButtonProps>(
  ({ className, children, showIcon = true, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
            "relative group border-none bg-transparent p-0 outline-none cursor-pointer text-base",
          className
        )}
        {...props}
      >
        {/* Shadow layer */}
        <span className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25 rounded-lg transform translate-y-0.5 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:translate-y-1 group-hover:duration-[250ms] group-active:translate-y-px"></span>
        
        {/* Background gradient layer */}
        <span className="absolute top-0 left-0 w-full h-full rounded-lg bg-gradient-to-l from-[hsl(217,33%,16%)] via-[hsl(217,33%,32%)] to-[hsl(217,33%,16%)]"></span>
        
        {/* Content layer with your custom color #976E4C */}
        <div className="relative flex items-center justify-between py-3 px-6 text-lg text-white rounded-lg transform -translate-y-1 bg-[#976E4C] hover:bg-[#866241] gap-3 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:-translate-y-1.5 group-hover:duration-[250ms] group-active:-translate-y-0.5 brightness-100 group-hover:brightness-110">
          <span className="select-none">{children}</span>
          {showIcon && (
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 ml-2 -mr-1 transition duration-250 group-hover:translate-x-1"
            >
              <path
                clipRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                fillRule="evenodd"
              ></path>
            </svg>
          )}
        </div>
      </button>
    );
  }
);

FancyButton.displayName = "FancyButton";

export { FancyButton };