"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormSubmitButtonProps = {
  idleText: string;
  pendingText: string;
  className?: string;
};

export const FormSubmitButton = ({
  idleText,
  pendingText,
  className,
}: FormSubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className={cn("w-full", className)}>
      {pending ? pendingText : idleText}
    </Button>
  );
};
