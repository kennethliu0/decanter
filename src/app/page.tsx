import {
  TournamentCard,
  TournamentInfo,
} from "@/app/(volunteers)/tournaments/search/TournamentCard";
import VolunteerEventRanking from "./components/VolunteerEventRankingDialog";

export default function Home() {
  let jso: TournamentInfo = {
    name: "JordanSO Invitational",
    startDate: new Date(2025, 2, 1),
    endDate: new Date(2025, 2, 8),
    testDeadlineDate: new Date(2025, 1, 15),
    applicationDeadlineDate: new Date(2025, 0, 15),
    location: "Online",
    websiteUrl: "https://https://scilympiad.com/jordan-so",
    division: "B",
    imageUrl: "https://www.duosmium.org/images/logos/jordan_invitational.png",
  };
  return (
    <div>
      <TournamentCard tournament={jso} />
    </div>
  );
}
