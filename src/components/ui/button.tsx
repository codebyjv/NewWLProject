import { cva, type VariantProps } from "class-variance-authority";
import { ReactNode } from "react";
import classNames from "classnames";
import { Slot } from "@radix-ui/react-slot";

const cn = classNames;

// Definindo as variantes
const buttonVariants = cva(
  "rounded-md font-medium transition-colors focus-visible:outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent",
        red: "bg-red-600 text-white hover:bg-red/50",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 py-2",
      },
      role: {
        combobox: "focus:ring-1 focus:ring-offset-2 focus:ring-offset-background hover:bg-red",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "red";
  size?: "sm" | "md";
  role?: "combobox";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const Button = ({
  variant,
  size,
  role,
  className,
  children,
  asChild,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        buttonVariants({ variant, size }),
        "inline-flex items-center justify-center whitespace-nowrap",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};