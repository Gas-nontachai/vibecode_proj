import * as React from "react";
import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  default: "bg-muted text-foreground",
  destructive: "border-destructive/50 text-destructive",
  success: "border-green-500/60 bg-green-500/10 text-green-700",
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
}

export const Alert = ({ className, variant = "default", ...props }: AlertProps) => (
  <div
    className={cn(
      "w-full rounded-lg border border-border px-4 py-3 text-sm",
      variants[variant],
      className,
    )}
    role="alert"
    {...props}
  />
);

export const AlertTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <h5 className={cn("mb-1 font-semibold leading-none tracking-tight", className)} {...props} />
);

export const AlertDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
);
