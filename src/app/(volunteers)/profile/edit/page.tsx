import { jay } from "@/app/data";
import ProfileCardEdit from "./ProfileCardEdit";

export default function Home() {
  return (
    <div>
      <ProfileCardEdit user={jay} />
    </div>
  );
}
