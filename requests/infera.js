/**
 * INFERA API CALL FUNCTIONS
 * author: @stefpi
 * date: 22/11/2024
 */

require('dotenv').config();

const fs = require("node:fs");
const path = require("node:path");

const prompt = fs.readFileSync(path.join(__dirname, '../system-prompt.txt'), 'utf-8');

let systemPrompt = [
  {
    "role": "system",
    "content": prompt,
  }
];

/**
 * Get LLM inference based on message context.
 * 
 * `messages` format
 * [{
 *    "role": "____",
 *    "content": "____"
 * }]
 */
async function get(messages, channel) {

  console.log(systemPrompt.concat(messages));

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

  console.log(res.status);
 
  if (res_data.status == "success") {
    const job_id = res_data.job_id;
    console.log("infera job id: ", job_id);

    return await getJobResults(job_id, channel);
  } else {
    console.log(res_data);
    return "sorry your message did not compute, please try again.";
  }
}

async function getJobResults(job_id, channel) {
  const MAX_RETRIES = 50;
  const RETRY_DELAY = 3000; // in ms

  const payload = {
    method: "GET",
    headers: {
      'accept': 'application/json',
      'api_key': `${process.env.INFERA_API_KEY}`,
    }
  }

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const res = await fetch(`https://api.infera.org/get_result/${job_id}`, payload);
    const res_data = await res.json();

    console.log("status: ", res_data.status);

    if (res.status != 404 && res.status != undefined) {
      return res_data.result.message.content;
    } 
    
    await channel.sendTyping();
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  return "sorry your message did not compute, please try again."
}

module.exports = { get }
