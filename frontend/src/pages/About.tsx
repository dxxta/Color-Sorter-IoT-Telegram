import {
  Title,
  Text,
  Divider,
  Grid,
  Avatar,
  Group,
  ActionIcon,
  Flex,
} from "@mantine/core";
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";

function About() {
  return (
    <>
      <Title order={1}>Tentang</Title>
      <br />
      <Text>
        Project ini dibuat oleh developer dalam rangka menyelesaikan tugas akhir
        mata kuliah Aplikasi Internet of Things. ColorSorter akan memberikan
        informasi tentang warna yang masuk dari alat IoT kami.
      </Text>
      <br />
      <Text>
        Secara default semua informasi akan ditampilkan pada logs website ini.
        Aplikasi ini juga menggunakan Telegram sebagai sarana informasi
        alternative. Untuk dapat menggunakan bot kami, Anda dapat mengaksesnya
        melalui link berikut.
      </Text>
      <Divider my="xl" />
      <Grid gutter="xl" justify="flex-start" align="stretch">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Flex direction="column" gap={15}>
            <Avatar src="/yoga.jpg" alt="Yoga Tri Permana" size="xl" />
            <section>
              <Text fw={800}>Yoga Tri Pramana</Text>
              <Text size="xs" mt="xs">
                Iure nostrum, nihil eius nam culpa maxime aspernatur
                exercitationem officia quo itaque commodi odit numquam modi
                omnis consectetur nemo veniam voluptatem ipsam!
              </Text>
            </section>
            <Group style={{ marginTop: "auto" }}>
              <ActionIcon variant="light" radius="md">
                <IconBrandLinkedin
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
              <ActionIcon variant="light" radius="md">
                <IconBrandGithub
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Group>
          </Flex>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Flex direction="column" gap={15}>
            <Avatar
              src="https://avatars.githubusercontent.com/u/72371776?v=4"
              alt="Mochammad Dinta Alif Syaifuddin"
              size="xl"
            />
            <section>
              <Text fw={800}>Mochammad Dinta Alif Syaifuddin</Text>
              <Text size="xs" mt="xs">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </Text>
            </section>
            <Group style={{ marginTop: "auto" }}>
              <ActionIcon variant="light" radius="md">
                <IconBrandLinkedin
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
              <ActionIcon variant="light" radius="md">
                <IconBrandGithub
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Group>
          </Flex>
        </Grid.Col>
      </Grid>
    </>
  );
}

export default About;
