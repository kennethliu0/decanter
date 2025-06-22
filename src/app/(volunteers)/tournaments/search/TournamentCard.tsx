import React from "react";
import { Globe } from "lucide-react";
import {
  Avatar,
  Badge,
  Box,
  Card,
  Flex,
  Heading,
  Text,
} from "@radix-ui/themes";
import VolunteerEventRankingDialog from "../VolunteerEventRankingDialog";

type Props = {
  tournament: TournamentInfo;
};

const TournamentCard = (props: Props) => {
  return (
    <Box
      maxWidth="400px"
      m="1"
    >
      <Card>
        <Flex gap="3">
          <Avatar
            src={props.tournament.imageUrl}
            alt={props.tournament.name}
            size="3"
            fallback="?"
          />
          <Box flexGrow="2">
            <Heading size="2">{props.tournament.name}</Heading>
            <Text size="1">
              {props.tournament.startDate.toLocaleDateString()} -{" "}
              {props.tournament.endDate.toLocaleDateString()}{" "}
            </Text>
            <Badge>{props.tournament.location}</Badge>{" "}
            <Badge>{props.tournament.division}</Badge>
          </Box>
          <a href={props.tournament.websiteUrl}>
            <Globe width="1.5em" />
          </a>
        </Flex>
        <Flex
          justify="between"
          align="center"
        >
          <Text size="1">
            Apply By{" "}
            {props.tournament.applicationDeadlineDate.toLocaleDateString()}{" "}
            Tests Due {props.tournament.testDeadlineDate.toLocaleDateString()}
          </Text>
          <VolunteerEventRankingDialog division={props.tournament.division} />
        </Flex>
      </Card>
    </Box>
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
  division: "B" | "C";
  imageUrl: string;
};

export { TournamentCard };
export type { TournamentInfo };
