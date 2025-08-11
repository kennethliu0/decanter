import { Avatar, AvatarFallback } from "@/components/shadcn/avatar";
import { getTournamentCounts } from "@/dal/tournament-application";
import { FolderOpen } from "lucide-react";
import Link from "next/link";

type Props = {};

const TournamentsSummary = async (props: Props) => {
  const { data, error } = await getTournamentCounts();

  const { savedApplications, tournamentsB, tournamentsC } = data || {
    savedApplications: 0,
    tournamentsB: 0,
    tournamentsC: 0,
  };
  return (
    <div className="w-full flex flex-col xs:flex-row xs:justify-stretch gap-4">
      <StatCard
        title="Saved Applications"
        count={savedApplications}
        link="/tournaments/search?page=1&saved=true"
        icon={<FolderOpen />}
      />
      <StatCard
        title="Div B Tournaments"
        count={tournamentsB}
        link="/tournaments/search?page=1&division=B"
        icon={
          <Avatar>
            <AvatarFallback>B</AvatarFallback>
          </Avatar>
        }
      />
      <StatCard
        title="Div C Tournaments"
        count={tournamentsC}
        link="/tournaments/search?page=1&division=C"
        icon={
          <Avatar>
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
        }
      />
    </div>
  );
};

const StatCard = ({
  title,
  count,
  link,
  icon,
}: {
  title: string;
  count: number;
  link: string;
  icon: React.ReactNode;
}) => {
  return (
    <Link
      href={link}
      className="hover:underline block group flex-1"
    >
      <div className="flex gap-4 p-4 rounded-lg bg-card border items-center hover:bg-muted/70">
        {icon}
        <div className="text-lg">
          {count} {title}
        </div>
      </div>
    </Link>
  );
};

export default TournamentsSummary;
