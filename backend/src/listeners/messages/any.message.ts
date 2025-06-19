import TelegramBot from "node-telegram-bot-api";

const saveforwarder = async (user: TelegramBot.User) => {
  try {
    const check_if_exist = await database.forwarder.findFirst({
      where: {
        telegram_id: user.id.toString(),
      },
    });

    if (!check_if_exist) {
      const avatar_path = (await telegrambot.getUserProfilePhotos(user.id))
        .photos[0][0].file_id;
      await database.forwarder.create({
        data: {
          telegram_id: user.id.toString(),
          username: user.username ?? "missing",
          avatar: `https://api.telegram.org/file/bot${
            process.env.TELEGRAM_TOKEN as string
          }/${avatar_path}`,
        },
      });
      return await database.forwarder.findFirst({
        where: {
          telegram_id: user.id.toString(),
        },
      });
    }

    return check_if_exist;
  } catch (error) {
    logging.error(error);
  }
};

export const anyMessage = () => {
  telegrambot.on("message", async (message) => {
    if (!message.from || !message.chat) return;
    if (message.entities) {
      const forwarder = await saveforwarder(message.from);

      if (message.text == "/start") {
        telegrambot.sendMessage(
          message.chat.id,
          "ColorSorterPSTI Bot akan memberikan informasi tentang warna yang masuk dari alat IoT kami. Untuk memulai, Anda bisa menggunakan /listen untuk mengaktifkan/menonaktifkan tools untuk menerima logs warna dari perangkat atau gunakan perintah berikut,\n\n- /start - Memulai komunikasi dengan bot\n- /listen - Menerima logs dari alat IoT ColorSorterPSTI\n- /colors - Melihat daftar warna yang terdaftar\n- /setcolor - Konfigurasi filter logs berdasarkan warna\n- /my - Melihat detail akun Anda pada sistem ColorSorterPSTI"
        );
      } else if (message.text == "/colors") {
        telegrambot.sendMessage(
          message.chat.id,
          "purple\nyellow\ngreen\npink\norange",
          {
            reply_to_message_id: message.message_id,
          }
        );
      } else if (message.text == "/listen") {
        const check_last_state = await database.forwarder.findFirst({
          where: {
            telegram_id: message.chat.id.toString(),
          },
        });

        await database.forwarder.update({
          where: {
            telegram_id: message.chat.id.toString(),
          },
          data: {
            is_listen: !check_last_state?.is_listen,
          },
        });

        telegrambot.sendMessage(
          message.chat.id,
          `Berhasil mengkonfigurasi listener menjadi ${!check_last_state?.is_listen}`,
          {
            reply_to_message_id: message.message_id,
          }
        );
      } else if (message.text == "/setcolor") {
        telegrambot
          .sendMessage(
            message.from.id,
            "Reply pesan ini dan ketikkan warna filter, contoh: purple,yellow",
            {
              reply_markup: {
                force_reply: true,
              },
              reply_to_message_id: message.message_id,
            }
          )
          .then((sentMessage) => {
            telegrambot.onReplyToMessage(
              sentMessage.chat.id,
              sentMessage.message_id,
              async (reply) => {
                const filter = reply.text?.toString();

                const response = await database.forwarder.update({
                  where: {
                    telegram_id: sentMessage.chat.id.toString(),
                  },
                  data: {
                    colors: {
                      set: [
                        ...new Set([
                          ...(forwarder?.colors ?? []),
                          ...(filter
                            ?.toLowerCase()
                            ?.trim()
                            ?.replaceAll(" ", "")
                            ?.split(",") ?? []),
                        ]),
                      ],
                    },
                    updated_date: new Date(),
                  },
                });

                telegrambot.sendMessage(
                  sentMessage.chat.id,
                  `Berhasil menambahkan filter, daftar filter Anda: ${response.colors}`,
                  {
                    reply_to_message_id: reply.message_id,
                  }
                );
              }
            );
          });
      } else if (message.text == "/my") {
        telegrambot.sendMessage(
          message.chat.id,
          `Berikut detail akun Anda dengan id ${
            forwarder!.id
          }:\n\n- Username: ${
            message.from.username
          }\n- Filter Warna: ${forwarder?.colors.join(", ")}\n- Logs: ${
            forwarder?.is_listen ? "Aktif" : "Tidak Aktif"
          }`,
          {
            reply_to_message_id: message.message_id,
          }
        );
      }
    }
    // else {
    //   const chatId = message.chat.id;
    //   const messageText = message.text;
    //   // Process the incoming message here
    // }
    // console.log(message);
  });
};
