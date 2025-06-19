import React from "react";
import { Globe } from "lucide-react";
import styles from "./TournamentCard.module.css";

type Props = {
  tournament: TournamentInfo;
};

const TournamentCard = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div style={{ display: "flex", gap: "6px" }}>
          <img
            src={props.tournament.imageUrl}
            height="40px"
          />
          <div>
            <h3>{props.tournament.name}</h3>
            <p className={styles.subtext}>
              {props.tournament.startDate.toLocaleDateString()} -{" "}
              {props.tournament.endDate.toLocaleDateString()} |{" "}
              {props.tournament.location}
            </p>
          </div>
        </div>
        <a href={props.tournament.websiteLink}>
          <Globe height="40px" />
        </a>
      </div>
      <div className={styles.footer}>
        <p className={styles.subtext}>
          Apply By {props.tournament.applicationDeadline.toLocaleDateString()}{" "}
          Tests Due {props.tournament.testDeadline.toLocaleDateString()}
        </p>
        <button className={styles.applyButton}>Apply</button>
      </div>
    </div>
  );
};

type TournamentInfo = {
  name: string;
  startDate: Date;
  endDate: Date;
  location: string;
  websiteLink: string;
  divisionB: boolean;
  divisionC: boolean;
  imageUrl: string;
  testDeadline: Date;
  applicationDeadline: Date;
};

export { TournamentCard };
export type { TournamentInfo };
