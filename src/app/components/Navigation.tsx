"use client";
import {
  Flex,
  Box,
  Text,
  Link,
  Container,
  IconButton,
  Avatar,
} from "@radix-ui/themes";
import { FlaskConical, Menu } from "lucide-react";
import React, { useState } from "react";

type Props = {
  children: React.ReactNode;
};

const Navigation = (props: Props) => {
  const links = [
    { label: "My Tournaments", path: "/" },
    { label: "Tournament Search", path: "/tournaments/search" },
    { label: "User Profile", path: "/" },
  ];
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav>
      <Box width="100%">
        <Flex
          height="80px"
          align="center"
          p="5"
          gap="5"
          style={{
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
            borderBottomColor: "var(--gray-7)",
          }}
        >
          <Flex
            flexGrow="1"
            align="center"
            gap="5"
          >
            <FlaskConical
              height="24px"
              width="24px"
            />
            <Text size="5">Decanter</Text>
            <Flex
              display={{ initial: "none", sm: "inline-flex" }}
              justify="start"
              flexGrow="1"
              gap="5"
            >
              {links.map((link, index) => (
                <Link
                  href={link.path}
                  key={index}
                >
                  <Text>{link.label}</Text>
                </Link>
              ))}
            </Flex>
          </Flex>
          <Container
            display={{ sm: "none" }}
            flexGrow="0"
          >
            <IconButton
              variant="ghost"
              size="2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu />
            </IconButton>
          </Container>
        </Flex>
        {menuOpen && (
          <Flex
            direction="column"
            gap="2"
            p="5"
            style={{ zIndex: 1 }}
          >
            {links.map((link, index) => (
              <Link
                href={link.path}
                key={index}
              >
                <Text>{link.label}</Text>
              </Link>
            ))}
          </Flex>
        )}
      </Box>
      {!menuOpen && props.children}
    </nav>
  );
};

export default Navigation;
