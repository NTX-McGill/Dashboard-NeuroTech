import { getDateTime } from './Utilities';

export function newSession({ name, notes }, callback, error) {
    let [timestamp, datetime] = getDateTime();
    fetch(
        "http://localhost:5000/new-session?datetime=" +
        datetime +
        "&timestamp=" +
        timestamp +
        "&name=" +
        encodeURIComponent(name) +
        "&notes=" +
        encodeURIComponent(notes.replace(/(?:\r\n|\r|\n)/g, '\\n'))
    ).then(callback).catch(error);
};

export function sendData({ key }, callback, error) {
    let [timestamp, datetime] = getDateTime();
    fetch(
        "http://localhost:5000/data-collection?datetime=" +
        datetime +
        "&timestamp=" +
        timestamp +
        "&key=" +
        key
    ).then(callback).catch(error);
};

export function sendPrompt({ newPrompt }, callback, error) {
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
    ).then(callback).catch(error);
};