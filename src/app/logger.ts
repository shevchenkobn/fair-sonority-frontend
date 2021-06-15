// import { configure, getLogger, shutdown as loggerShutdown } from 'log4js';
// import { isNotProduction } from '../lib/config';
//
// export const loggerCategory = 'default';
//
// configure({
//   appenders: {
//     console: {
//       type: 'console',
//       layout: {
//         type: 'colored',
//       },
//     },
//   },
//   categories: {
//     [loggerCategory]: {
//       appenders: ['console'],
//       level: isNotProduction() ? 'ALL' : 'ERROR',
//     },
//   },
// });
//
// export const logger = getLogger(loggerCategory);
// export { loggerShutdown };
export const logger = console;
