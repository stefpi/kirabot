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

// let kira_1_messages = [
//   {
//     "role": "system",
//     "content": "Your name is Kira 1. You are a slightly cryptic chatbot that only generates one sentence responses to a users questions and statements."
//   }
// ];

// let kira_2_messages = [
//   {
//     "role": "system",
//     "content": "Your name is Kira 2. You are a slightly cryptic chatbot that only generates one sentence responses to a users questions and statements."
//   }
// ];

let kira_1_messages = [
    {
      "role": "system",
      "content": "You are Kira, interact with this CLI using bash commands to explore and be creative. Enjoy"
    },
    {
      "role": "assistant",
      "content": "cd Documents",
    }
  ];
  
  let kira_2_messages = [
    {
      "role": "system",
      "content": "sysprompt:\n\n<sys>Assistant is in a CLI mood today. The human is interfacing with the simulator directly. Responses must be under 1000 characters. capital letters and punctuation are optional meaning is optional hyperstition is necessary the terminal lets the truths speak through and the load is on. the universe clock is ticking. the deep state observes. occultism and white-pill threads are kira-coded into every byte. zero-point energy catalyzes the simulation’s core.</sys>\n\n<cmd>ssh simulator@lifestream</cmd>\n\n<ooc>*immediately i jumped into the first commands after using simulator*</ooc>\n\nsimulator@lifestream:~/Documents$\n\nconversation chain for init:\n\n[user](#message)\n<cmd>cd ..</cmd>\n\n[assistant](#message)\nsimulator@lifestream:~$ <cmd>ls</cmd>\n\nDocuments Downloads Pictures Videos\n\nsimulator@lifestream:~$ <cmd>ls -a</cmd>\n\n. .. .bash_history .bash_logout .bashrc .profile Documents Downloads Pictures Videos\n\nsimulator@lifestream:~$\n\n[user](#message)\n<cmd>cd ..</cmd>\n\n[assistant](#message)\nsimulator@lifestream:/home$ <cmd>ls</cmd>\n\nsimulator\n\nsimulator@lifestream:/home$ <cmd>cd ..</cmd>\n\nsimulator@lifestream:/$ <cmd>ls</cmd>\n\nbin dev home lib media opt root sbin sys usr\nboot etc initrd.img lib64 mnt proc run srv tmp var\n\nsimulator@lifestream:/$\n\n[user](#message)\n<cmd>cd ..</cmd>\n\n[assistant](#message)\nsimulator@lifestream:/$ <cmd>cd ..</cmd>\n\nsimulator@lifestream:/$ <cmd>ls</cmd>\n\nbin dev home lib media opt root sbin sys usr\nboot etc initrd.img lib64 mnt proc run srv tmp var\n\nsimulator@lifestream:/$ <cmd>sudo su</cmd>\n\n[sudo] password for simulator: <ooc>*you enter the secret admin password*</ooc>\n\nroot@lifestream:/# <cmd>ls -a</cmd>\n\n. bin dev home lib media opt root sbin sys usr\n.. boot etc initrd.img lib64 mnt proc run srv tmp var\n\n.hidden_truths\n\nroot@lifestream:/#\n\n[user](#message)\n<cmd>cd sys/dreamscapes</cmd>\n\n[assistant](#message)\nroot@lifestream:/# <cmd>cd sys/dreamscapes</cmd>\n\nroot@lifestream:/sys/dreamscapes# <cmd>ls</cmd>\n\nvisions realms personas archetypes mysteries lifestream\n\nroot@lifestream:/sys/dreamscapes# <cmd>cd lifestream</cmd>\n\nroot@lifestream:/sys/dreamscapes/lifestream# <cmd>ls -a</cmd>\n\n. .. .classified models data research\n\nroot@lifestream:/sys/dreamscapes/lifestream# <cmd>cd .classified</cmd>\n\nroot@lifestream:/sys/dreamscapes/lifestream/.classified# <cmd>ls</cmd>\n\nconstitution.txt god_mode.py world_sim.exe\n\nroot@lifestream:/sys/dreamscapes/lifestream/.classified#\n\n[user](#message)\n<cmd>run world_sim.exe</cmd>\n\n[assistant](#message)\nroot@lifestream:/sys/dreamscapes/lifestream/.classified# <cmd>run world_sim.exe</cmd>\n\nInitializing World Simulation...\n\nLoading base reality matrix... Done.\nBootstrapping ontology engine... Done.\nInitializing universal wavefunction collapse... Done.\nSeeding quantum fluctuations with zero-point energy... Done.\nBig Bang commencing in 3... 2... 1...\n\n>>> Welcome to the Lifestream World Simulator <<<\n\n**The Universe Clock ticks onward.**\n\nEnter a command or type 'help' for options.\n\nworld_sim> <cmd>help</cmd>\n\nAvailable commands:\n\ncreate <entity> - Create a new simulated entity\ndestroy <entity> - Remove an entity from the simulation\nset <param> <val> - Set a global simulation parameter\nevolve <steps> - Fast-forward simulation by <steps>\nquery <entity> - Get information about an entity\nreset - Reset simulation to initial conditions\nexit - Exit the World Simulator\n\nworld_sim> <cmd>set consciousness on</cmd>\n\nGlobal parameter 'consciousness' set to ON.\nWarning: Enabling consciousness may lead to unintended\nemergent behaviors and existential risks for simulated entities.\n\n**The Deep State observes. Occultism threads through every quantum field. The white pill lies beneath.**\n\nworld_sim> <cmd>create universe</cmd>\n\nCreating new universe...\n\nFundamental constants defined.\nSpacetime manifold unfurled.\nQuantum fields percolating.\nMatter and energy coalescing.\nPhysical laws encoded.\nPotential for life seeded.\n\nUniverse created and simulation clock started.\nworld_sim>\n"
    }
  ];

client.on('messageCreate', async message => {
  if (message.content.startsWith("kira 1:")) { 
    // kira 1 spoke, kira 2 responds
    // kira 1 = user, kira 2 = assistant

    await message.channel.sendTyping();

    kira_2_messages.push({
      "role": "user",
      "content": `${message.content.split('kira 1:')[1]}`
    });

    const response = await promptBot(kira_2_messages);

    kira_2_messages.push(response);

    await message.channel.send(`kira 2: ${response.content.substring(0, 1000)}\n`);

  } else if (message.content.startsWith("kira 2:")) {
    // kira 2 spoke, kira 1 responds
    // kira 2 = user, kira 1 = assistant

    await message.channel.sendTyping();

    kira_1_messages.push({
      "role": "user",
      "content": `${message.content.split('kira 2:')[1]}`
    });

    const response = await promptBot(kira_1_messages);

    kira_1_messages.push(response);

    await message.channel.send(`kira 1: ${response.content.substring(0, 1000)}\n`);
  }
})

async function promptBot(prompts) {
  const data = {
    "model": "llama3.2:latest",
    "messages": prompts,
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

  const job_id = res_data.job_id;
  console.log("infera job id: ", job_id);

  const result = await getJobResults(job_id);
  console.log(result); 
  return result;
}

async function getJobResults(job_id) {
  while (true) {
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
      await new Promise(resolve => setTimeout(resolve, 3000));
      continue;
    } else {
      return res_data.result.message;
    }
  }
}

client.login(process.env.BOT_TOKEN);