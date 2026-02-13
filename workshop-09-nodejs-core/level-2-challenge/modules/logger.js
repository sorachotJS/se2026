// modules/logger.js
const chalk = require('chalk');

class Logger {
  info(message) {
    console.log(chalk.blue('ℹ'), message);
  }

  success(message) {
    console.log(chalk.green('✔'), message);
  }

  warning(message) {
    console.log(chalk.yellow('⚠'), message);
  }

  error(message) {
    console.log(chalk.red('✖'), message);
  }

  table(data) {
    console.table(data);
  }
}

module.exports = new Logger();