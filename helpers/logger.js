/* eslint-disable no-console */
function log(...args) {
  return console.log(...args);
}

function error(...args) {
  return console.error(...args);
}

function warn(...args) {
  return console.warn(...args);
}

function info(...args) {
  return console.info(...args);
}

const logger = {
  log,
  error,
  warn,
  info,
};

export default logger;
