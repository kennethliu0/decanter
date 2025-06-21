import React from "react";
import { Globe } from "lucide-react";
import styles from "./TournamentCard.module.css";

type Props = {
  tournament: TournamentInfo;
};

const TournamentCard = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img
          src={props.tournament.imageUrl}
          alt={props.tournament.name}
          className={styles.tournamentIcon}
          height="40px"
        />
        <div style={{ flexGrow: 2 }}>
          <h3>{props.tournament.name}</h3>
          <p className={styles.subtext}>
            {props.tournament.startDate.toLocaleDateString()} -{" "}
            {props.tournament.endDate.toLocaleDateString()} |{" "}
            {props.tournament.location}{" "}
            {props.tournament.divisionB ?
              props.tournament.divisionC ?
                "B/C"
              : "B"
            : "C"}
          </p>
        </div>
        <a href={props.tournament.websiteUrl}>
          <Globe width="1.5em" />
        </a>
      </div>
      <div className={styles.footer}>
        <p className={styles.subtext}>
          Apply By{" "}
          {props.tournament.applicationDeadlineDate.toLocaleDateString()} Tests
          Due {props.tournament.testDeadlineDate.toLocaleDateString()}
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
  testDeadlineDate: Date;
  applicationDeadlineDate: Date;
  location: string;
  websiteUrl: string;
  divisionB: boolean;
  divisionC: boolean;
  imageUrl: string;
};

export { TournamentCard };
export type { TournamentInfo };
