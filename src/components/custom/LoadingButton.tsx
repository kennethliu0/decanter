import React from "react";
import { Button } from "../shadcn/button";
import { LoaderCircle } from "lucide-react";

type Props = {
  pending: boolean;
  children: React.ReactNode;
} & React.ComponentProps<typeof Button>;

const LoadingButton = ({ pending, children, disabled, ...props }: Props) => {
  return (
    <Button
      disabled={pending || disabled}
      className="relative"
      {...props}
    >
      {pending && (
        <LoaderCircle className="mx-auto animate-spin absolute m-auto h-5 w-4" />
      )}
      <span className={pending ? "invisible" : "visible"}>{children}</span>
    </Button>
  );
};

export default LoadingButton;
