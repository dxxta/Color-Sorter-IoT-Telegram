import {
  Button,
  Title,
  Text,
  Anchor,
  Skeleton,
  Textarea,
  Table,
  Tabs,
  Badge,
  Blockquote,
  Image,
  Group,
  Pagination,
  Flex,
  Highlight,
  useMantineColorScheme,
} from "@mantine/core";
import { IconArrowRight, IconInfoCircle, IconRobot } from "@tabler/icons-react";
import { CodeHighlight } from "@mantine/code-highlight";
import { useEffect, useState } from "react";
import { SocketContextType } from "../context/socket";
import { useFetch } from "@mantine/hooks";

const botLink = import.meta.env.VITE_BOT_URL;

export type PropsType = SocketContextType & { fooEvents: string[] };

function Homepage({ socketStatus, fooEvents }: PropsType) {
  const { colorScheme } = useMantineColorScheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [skip, setSkip] = useState<number>(1);
  const [take] = useState<number>(5);
  const [tabValue, setTabValue] = useState<string | null>("logs");
  const {
    data: subscriberData,
    loading: subscriberLoading,
    refetch,
  } = useFetch<{
    success: boolean;
    message?: string;
    total?: number;
    pages?: number;
    result?: {
      id: string;
      telegram_id: string;
      username: string;
      avatar?: string;
      is_listen: boolean;
      colors: string[];
      created_date?: string;
      updated_date?: string;
    }[];
  }>(
    `${import.meta.env.VITE_BASE_URL}/subscriber?${new URLSearchParams([
      ["skip", skip.toString()],
      ["take", take.toString()],
    ]).toString()}`
  );

  useEffect(() => {
    setTimeout(() => {
      setLoading(!socketStatus);
    }, 1000);
  }, [socketStatus]);

  useEffect(() => {
    if (tabValue == "subscriber") {
      refetch();
    }
  }, [tabValue]);

  return (
    <>
      <Badge color={socketStatus ? "blue" : "red"}>
        Status: {socketStatus ? "live" : "down"}
      </Badge>
      <Title order={1}>Beranda</Title>
      <br />
      <Text>
        ColorSorter akan memberikan informasi tentang warna yang masuk dari alat
        IoT kami. Secara default semua informasi akan ditampilkan pada logs
        website ini.
      </Text>
      <br />
      <Text>
        Aplikasi ini juga menggunakan Telegram sebagai sarana informasi
        alternative. Untuk dapat menggunakan bot kami, Anda dapat mengaksesnya
        melalui{" "}
        <Anchor href={botLink} target="_blank">
          link berikut.
        </Anchor>
      </Text>
      <br />
      <Button
        variant="light"
        leftSection={<IconRobot size={14} />}
        rightSection={<IconArrowRight size={14} />}
        onClick={() => window.open(botLink, "_blank")}
      >
        Visit Bot
      </Button>
      <br />
      <br />
      <Skeleton visible={loading}>
        <Tabs
          defaultValue="logs"
          value={tabValue}
          onChange={(value) => setTabValue(value)}
        >
          <Tabs.List>
            <Tabs.Tab value="logs">Logs</Tabs.Tab>
            <Tabs.Tab value="konfigurasi">Konfigurasi</Tabs.Tab>
            <Tabs.Tab value="subscriber">Subscriber</Tabs.Tab>
          </Tabs.List>
          <br />
          <Tabs.Panel value="logs">
            <Textarea
              variant="filled"
              placeholder="Live logs"
              resize="vertical"
              value={fooEvents?.join("\n")}
              minRows={6}
              maxRows={6}
              autosize
              disabled
            />
          </Tabs.Panel>

          <Tabs.Panel value="konfigurasi">
            <Blockquote color="blue" icon={<IconInfoCircle />}>
              Broker berjalan pada satu arsitektur yang sama dengan server
            </Blockquote>
            <br />
            <Flex direction="column" gap="md">
              <Title order={5}>Broker</Title>
              <Highlight highlight="default/logs">
                Publish dan Subscribe pada topic default/logs.
              </Highlight>
              <CodeHighlight
                code={`
                    mosquitto_sub -h 0.0.0.0 -t logs  
                  `}
                language="tsx"
                copyLabel="Copy subscriber command"
                copiedLabel="Copied!"
                bg={colorScheme == "dark" ? "dark" : "gray.1"}
                p="sm"
              />
              <CodeHighlight
                code={`
                    mosquitto_pub -h 0.0.0.0 -t logs -m "<message>" 
                  `}
                language="js"
                copyLabel="Copy publisher command"
                copiedLabel="Copied!"
                bg={colorScheme == "dark" ? "dark" : "gray.1"}
                p="sm"
              />
            </Flex>
            <br />
            <Group>
              <Title order={5}>Topology Server</Title>
              <Image
                src="/topology.png"
                bg="white"
                bd="5px dotted blue"
                radius="sm"
              />
            </Group>
            <br />

            {/* <Group>
              <Title order={5}>Circuit</Title>
            </Group> */}
          </Tabs.Panel>
          <Tabs.Panel value="subscriber">
            <Skeleton visible={subscriberLoading}>
              <Table>
                <Table.Thead variant="filled">
                  <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Username</Table.Th>
                    <Table.Th>Filter</Table.Th>
                    <Table.Th>Terdaftar</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {subscriberData?.result?.map((el) => (
                    <Table.Tr key={el.id}>
                      <Table.Td>{el.id}</Table.Td>
                      <Table.Td>{el.username}</Table.Td>
                      <Table.Td>
                        {el.colors?.length > 0 ? el.colors?.join(", ") : "-"}
                      </Table.Td>
                      <Table.Td>
                        {el.created_date
                          ? new Date(el.created_date).toLocaleDateString(
                              "id-ID",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "-"}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <br />
              <Pagination
                total={subscriberData?.pages ?? 1}
                value={skip}
                onChange={(value) => setSkip(value)}
              />
            </Skeleton>
          </Tabs.Panel>
        </Tabs>
      </Skeleton>
    </>
  );
}

export default Homepage;
