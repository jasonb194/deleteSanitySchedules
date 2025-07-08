# Delete Sanity Schedules

A TypeScript utility to delete schedules from your Sanity.io project. By default, this tool removes schedules in the 'succeeded' state, but can be configured to delete schedules in other states (scheduled, cancelled).

## Prerequisites

- A Sanity project
- Sanity CLI installed (`npm install -g @sanity/cli`)
- Being logged in to Sanity CLI (`sanity login`)

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

## Usage

This script uses `sanity exec` to run in the context of your Sanity project, which automatically handles authentication and project configuration. The TypeScript code is automatically compiled before execution.

### Command Line Arguments

- `--days=<number>`: Specify how many days old a schedule must be to be considered for deletion. Defaults to 90 days if not specified.
- `--dry-run=<boolean>`: Whether to run in dry-run mode (default: true).
- `--state=<string>`: Filter schedules by state ('succeeded', 'scheduled', or 'cancelled'). Defaults to 'succeeded' if not specified.

### Dry Run Mode (Safe Mode) - Default
To preview which completed schedules would be deleted without actually deleting them:

Using pnpm:
```bash
pnpm start
# Or specify a custom number of days:
pnpm start -- --days=30
```

Using npm:
```bash
npm run start
# Or specify a custom number of days:
npm run start -- --days=30
```

### Actual Deletion
To perform the actual deletion of completed schedules:

Using pnpm:
```bash
pnpm delete
# Or specify a custom number of days:
pnpm delete -- --days=30
```

Using npm:
```bash
npm run delete
# Or specify a custom number of days:
npm run delete -- --days=30
```

The script will provide detailed output including:
- Number of completed schedules found
- Schedule IDs and details (sorted by creation date, oldest first)
- Deletion status for each schedule
- Summary of operations

## Features

- Written in TypeScript for better type safety and developer experience
- Dry run mode to safely preview changes
- State filtering (succeeded, scheduled, cancelled)
- Uses Sanity CLI for authentication
- Detailed logging of operations
- Continues processing if individual deletions fail