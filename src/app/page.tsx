import {
  TournamentCard,
  TournamentInfo,
} from "@/app/components/TournamentCard";

export default function Home() {
  let jso: TournamentInfo = {
    name: "JordanSO Invitational",
    startDate: new Date(2025, 2, 1),
    endDate: new Date(2025, 2, 8),
    location: "Online",
    websiteLink: "https://https://scilympiad.com/jordan-so",
    divisionB: true,
    divisionC: true,
    imageUrl: "https://www.duosmium.org/images/logos/jordan_invitational.png",
    testDeadline: new Date(2025, 1, 15),
    applicationDeadline: new Date(2025, 0, 15),
  };
  return (
    <div>
      <TournamentCard tournament={jso} />
    </div>
  );
}
