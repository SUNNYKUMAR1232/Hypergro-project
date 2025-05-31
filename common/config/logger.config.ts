import pino from 'pino';
import pretty from 'pino-pretty';

const stream = pretty({
  colorize: true,           // Adds color to the output
  levelFirst: true,         // Show level before message
  translateTime: 'SYS:standard', // Human-readable timestamp
  ignore: 'pid,hostname'    // Hide unneeded fields
});

const levels = {
  emerg: 80,
  alert: 70,
  crit: 60,
  error: 50,
  warn: 40,
  notice: 30,
  info: 20,
  debug: 10,
};

const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'info',
    customLevels: levels,
    useOnlyCustomLevels: true,
  },
  stream
);

export default logger;
