// index.js
const taskManager = require('./modules/taskManager');
const logger = require('./modules/logger');
const { config, validateConfig } = require('./modules/config');

// Validate configuration
try {
  validateConfig();
} catch (error) {
  logger.error(error.message);
  process.exit(1);
}

// Show banner
function showBanner() {
  console.log('\n' + '='.repeat(60));
  console.log(`  📝 ${config.appName}`);
  console.log('='.repeat(60) + '\n');
}

// Show help
function showHelp() {
  console.log('Usage: node index.js <command> [arguments]\n');
  console.log('Commands:');
  console.log('  add <title> [priority]       - Add a new task (priority: low/medium/high)');
  console.log('  list [filter]                - List tasks (filter: all/pending/completed)');
  console.log('  complete <id>                - Mark task as completed');
  console.log('  delete <id>                  - Delete a task');
  console.log('  update <id> <title>          - Update task title');
  console.log('  stats                        - Show statistics');
  console.log('  export <filename>            - Export tasks to JSON file');
  console.log('  import <filename>            - Import tasks from JSON file');
  console.log('  help                         - Show this help\n');
  console.log('Examples:');
  console.log('  node index.js add "Buy groceries" high');
  console.log('  node index.js list pending');
  console.log('  node index.js complete 1');
}

// Main function
async function main() {
  showBanner();

  const args = process.argv.slice(2);
  console.log('args : ',args)
  const command = args[0];

  try {
    switch (command) {
      case 'add':
        if (!args[1]) {
          logger.error('Please provide a task title');
          break;
        }
        const priority = args[2] || 'medium';
        await taskManager.addTask(args[1], priority);
        break;

      case 'list':
        const filter = args[1] || 'all';
        await taskManager.listTasks(filter);
        break;

      case 'complete':
        if (!args[1]) {
          logger.error('Please provide task ID');
          break;
        }
        await taskManager.completeTask(parseInt(args[1]));
        break;

      case 'delete':
        if (!args[1]) {
          logger.error('Please provide task ID');
          break;
        }
        await taskManager.deleteTask(parseInt(args[1]));
        break;

      case 'update':
        if (!args[1] || !args[2]) {
          logger.error('Please provide task ID and new title');
          break;
        }
        await taskManager.updateTask(parseInt(args[1]), args[2]);
        break;

      case 'stats':
        await taskManager.showStats();
        break;

      case 'export':
        if (!args[1]) {
          logger.error('Please provide export filename');
          break;
        }
        await taskManager.exportTasks(args[1]);
        break;

      case 'import':
        if (!args[1]) {
          logger.error('Please provide import filename');
          break;
        }
        await taskManager.importTasks(args[1]);
        break;

      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();