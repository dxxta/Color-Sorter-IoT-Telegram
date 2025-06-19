import {
  useMantineColorScheme,
  Group,
  AppShell,
  Flex,
  Text,
  ActionIcon,
  Container,
  NavLink,
  Image,
  Anchor,
  Title,
} from "@mantine/core";
import {
  IconSun,
  IconMoon,
  IconBrightnessAuto,
  IconHome2,
  IconExclamationCircleFilled,
} from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { SocketContext } from "./context/socket";
import Homepage from "./pages/Homepage";
import About from "./pages/About";

function App() {
  console.log(import.meta.env.VITE_BASE_URL);
  console.log(import.meta.env.VITE_WS_URL);
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [fooEvents, setFooEvents] = useState<string[]>([]);
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const { socketClient, socketStatus } = useContext(SocketContext);

  useEffect(() => {
    if (!socketClient) return;
    socketClient.on("logs", (value: string) => {
      setFooEvents((previous) => [...previous, value]);
    });
  }, [socketClient]);

  return (
    <>
      <AppShell header={{ height: 50 }} padding="md">
        <AppShell.Header>
          <Container h={"100%"}>
            <Group h={"100%"} justify="space-between" align="center">
              <Flex gap="xs">
                <Image src="/logo.png" w={25} />
                <Title order={5}>ColorSorter</Title>
              </Flex>
              <Flex justify="space-between" align="center" gap="xs">
                {[
                  {
                    label: "Beranda",
                    path: "/",
                    icon: <IconHome2 size="1rem" stroke={1.5} />,
                  },
                  {
                    label: "Tentang",
                    path: "/tentang",
                    icon: (
                      <IconExclamationCircleFilled size="1rem" stroke={1.5} />
                    ),
                  },
                ].map((item, index) => (
                  <NavLink
                    key={item.label}
                    fz="xs"
                    active={index === active}
                    label={item.label}
                    leftSection={item.icon}
                    onClick={() => {
                      setActive(index);
                      navigate(item.path);
                    }}
                  />
                ))}
              </Flex>
              <Flex gap="xs">
                <ActionIcon aria-label="Toggle Theme" size="md">
                  {colorScheme == "dark" ? (
                    <IconSun
                      onClick={() => setColorScheme("light")}
                      style={{ width: "70%", height: "70%" }}
                      stroke={1.5}
                    />
                  ) : (
                    <IconMoon
                      onClick={() => setColorScheme("dark")}
                      style={{ width: "70%", height: "70%" }}
                      stroke={1.5}
                    />
                  )}
                </ActionIcon>
                <ActionIcon>
                  <IconBrightnessAuto
                    aria-label="Toggle Theme Auto"
                    onClick={() => setColorScheme("auto")}
                    style={{ width: "70%", height: "70%" }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Flex>
            </Group>
          </Container>
        </AppShell.Header>
        <AppShell.Main>
          <Container>
            <Routes>
              <Route
                path="/"
                element={
                  <Homepage
                    socketClient={socketClient}
                    socketStatus={socketStatus}
                    fooEvents={fooEvents}
                  />
                }
              />
              <Route path="/tentang" element={<About />} />
              <Route
                path="*"
                element={
                  <>
                    <Flex justify="center" align="center" h={"90vh"}>
                      <Image src="/error.svg" w="auto" h={"350px"} />
                    </Flex>
                  </>
                }
              />
            </Routes>
            <br />
            <br />
            <br />
            <br />
            <br />
          </Container>
        </AppShell.Main>
        <AppShell.Footer>
          <Container ta="center">
            <Text my="xl">
              Created by <Anchor>Mochammad Dinta Alif Syaifuddin</Anchor> &{" "}
              <Anchor>Yoga Tri Pramana</Anchor>
            </Text>
          </Container>
        </AppShell.Footer>
      </AppShell>
    </>
  );
}

export default App;
