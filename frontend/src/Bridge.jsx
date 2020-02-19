import { getDateTime } from "./Utilities";

export function newSession({ name, notes, mode }, callback) {
  let [timestamp, datetime] = getDateTime();
  fetch(
    "http://localhost:5000/new-session?datetime=" +
    datetime +
    "&timestamp=" +
    timestamp +
    "&name=" +
    encodeURIComponent(name) +
    "&notes=" +
    encodeURIComponent(notes.replace(/(?:\r\n|\r|\n)/g, "\\n")) +
    "&mode=" +
    mode

  )
    .then(res => callback({ res, datetime, timestamp }))
    .catch(console.log);
}

export function sendData({ key }, callback) {
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

export function sendPrompt({ newPrompt }, callback) {
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
