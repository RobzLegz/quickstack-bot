import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  SlashCommandBuilder,
  CommandInteraction,
} from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TOKEN;

if (!token) {
  console.error("TOKEN is not defined in the .env file.");
  process.exit(1);
}

// Extend the Client class to include a `commands` collection
class CustomClient extends Client {
  commands: Collection<string, any>;

  constructor(options: any) {
    super(options);
    this.commands = new Collection();
  }
}

const client = new CustomClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Define the skibidi command
const skibidiCommand = {
  data: new SlashCommandBuilder()
    .setName("skibidi")
    .setDescription("Replies with Pong!"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply("Pong!");
  },
};

// Add the skibidi command to the client's commands collection
client.commands.set(skibidiCommand.data.name, skibidiCommand);

// Event: When the bot is ready
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Event: Handle interactions (slash commands)
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`Command ${interaction.commandName} not found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

// Log in to Discord with your client's token
client.login(token);
