require('dotenv').config();

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
})

let systemPrompt = [
  {
    "role": "system",
    "content": "Your name is Kira. You are a slightly cryptic chatbot that only generates one sentence responses to a users questions and statements."
  }
];

let messages = [];

client.on('messageCreate', async message => {
  if (client.user.id != message.author.id) {
    console.log("message: ", message.content);

    await message.channel.sendTyping();

    if (messages.length >= 1000) {
      messages.shift();
    }

    messages.push({
      "role": "user",
      "content": `${message.content}`
    });

    const data = {
      "model": "llama3.2:latest",
      "messages": systemPrompt.concat(messages),
      "max_output": 0,
      "temperature": 0
    }

    const payload = {
      method: "POST",
      headers: {
        'accept': 'application/json',
        'api_key': `${process.env.INFERA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }

    const res = await fetch("https://api.infera.org/submit_job", payload);
    const res_data = await res.json();

    console.log(messages)
    
    const job_id = res_data.job_id;
    console.log("infera job id: ", job_id);

    getJobResults(job_id, async (data) => {
      await message.channel.send(`${data}`);
    });
  }
})

function getJobResults(job_id, callback) {
  setTimeout(async function() {
    const payload = {
      method: "GET",
      headers: {
        'accept': 'application/json',
        'api_key': `${process.env.INFERA_API_KEY}`,
      }
    }
    const res = await fetch(`https://api.infera.org/get_result/${job_id}`, payload);
    const res_data = await res.json();

    console.log("status: ", res_data.status);

    if (res.status == 404) {
      getJobResults(job_id, callback);
    } else {
      messages.push(res_data.result.message);
      if (messages.length >= 1000) {
        messages.shift();
      }
      callback(res_data.result.message.content);
    }
  }, 3000)
}

client.login(process.env.BOT_TOKEN);