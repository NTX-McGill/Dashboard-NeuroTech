import { getDateTime } from "./Utilities";

export async function newSession({ id, notes, prompts, mode , hand, trial}, callback) {
  let [timestamp, datetime] = getDateTime();
  let mode_str = "Self-directed";
  if (mode === 1) {
    mode_str = "Guided";
    JSON.stringify(prompts);
  }
  else if (mode === 2) mode_str = "In-the-air";
  fetch(
    "http://localhost:5000/new-session?datetime=" +
    datetime +
    "&timestamp=" +
    timestamp +
    "&id=" +
    encodeURIComponent(id) +
    "&notes=" +
    encodeURIComponent(notes.replace(/(?:\r\n|\r|\n)/g, "\\n")) +
    "&mode=" +
    mode_str + 
    "&prompts=" +
    prompts + 
    "&hand=" +
    hand + 
    "&trial=" +
    trial
  )
    .then(res => callback({ res, datetime, timestamp }))
    .catch(console.log);
}

export async function sendData({ key }, callback) {
  if (key === " ")
    key = "space";

  let [timestamp, datetime] = getDateTime();
  fetch(
    "http://localhost:5000/data-collection?datetime=" +
    datetime +
    "&timestamp=" +
    timestamp +
    "&key=" +
    key
  )
    .then(res => callback({ res, datetime, timestamp, key }))
    .catch(console.log);
}

export async function sendPrompt({ newPrompt }, callback) {
  let [timestamp, datetime] = getDateTime();
  fetch(
    "http://localhost:5000/prompt?datetime=" +
    datetime +
    "&timestamp=" +
    timestamp +
    "&hand=" +
    newPrompt.hand +
    "&finger=" +
    newPrompt.finger
  )
    .then(res => callback({ res, datetime, timestamp, newPrompt }))
    .catch(console.log);
}

export async function sendCustomPrompt({ newCustomPrompt }, callback) {
  let [timestamp, datetime] = getDateTime();
  fetch(
    "http://localhost:5000/custom-prompt?datetime=" +
    datetime +
    "&timestamp=" +
    timestamp +
    "&prompt=" +
    newCustomPrompt
  )
    .then(res => callback({ res, datetime, timestamp, newCustomPrompt }))
    .catch(console.log);
}