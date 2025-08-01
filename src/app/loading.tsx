import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <LoaderCircle className="mx-auto animate-spin absolute m-auto h-5 w-4" />
    </div>
  );
}
