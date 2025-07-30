import { Result } from "@/lib/definitions";
import { use } from "react";
import ShareInviteButton from "./ShareInviteButton";

type Props = {
  invitePromise: Promise<Result<{ link: string; emails: string[] }>>;
};

const InviteManagement = (props: Props) => {
  const { data, error } = use(props.invitePromise);
  if (error) {
    return <div className="text-destructive">{error.message}</div>;
  }
  return (
    <div className="space-y-2">
      {data?.emails ?
        <div>
          <p>Currently added users:</p>
          <ul>
            {data.emails.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
        </div>
      : <p>Could not retrieve currently added users</p>}

      <ShareInviteButton inviteLink={data?.link ?? ""} />
      <p className="text-sm">
        Note that you cannot remove users from management without contacting
        Decanter support. This link should never be shared to anyone except
        tournament directors.
      </p>
    </div>
  );
};

export default InviteManagement;
