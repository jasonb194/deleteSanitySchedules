# Delete Sanity.io Schedules

A Node.js utility script to clean up completed schedules in your Sanity.io project. This tool helps manage and remove succeeded schedule entries, keeping your Sanity.io project tidy.

## Features

- Lists all completed (succeeded) schedules in your Sanity.io project
- Supports dry-run mode to preview deletions without making changes
- Detailed logging of operations
- Batch deletion with error handling
- Environment variable configuration for secure credential management

## Prerequisites

- Node.js (v14 or higher recommended)
- pnpm package manager
- Sanity.io project with API access

## Installation

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd deleteschedules
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file in the project root with your Sanity.io credentials:
   ```env
   SANITY_API_TOKEN=your_token_here
   SANITY_STUDIO_PROJECT_ID=your_project_id
   SANITY_STUDIO_DATASET=your_dataset
   ```

## Usage

### Dry Run (Safe Mode)
To preview which schedules would be deleted without actually deleting them:

```bash
pnpm start
# or
pnpm start --dry-run=true
```

### Actual Deletion
To perform the actual deletion of completed schedules:

```bash
pnpm start --dry-run=false
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SANITY_API_TOKEN` | Your Sanity.io API token with write access | Yes |
| `SANITY_STUDIO_PROJECT_ID` | Your Sanity.io project ID | Yes |
| `SANITY_STUDIO_DATASET` | The dataset name (e.g., 'production') | Yes |

## Output

The script provides detailed output including:
- Number of completed schedules found
- Schedule IDs and creation dates
- Deletion status for each schedule
- Summary of successful and failed operations

Example output:
```
Environment variables loaded:
- Token is present (first 4 characters): xxxx
- Project ID: your_project_id
- Dataset: production
- Dry run mode: enabled (will not delete)

Fetching completed schedules...
Found 5 completed schedules
Schedule ID: abc123, Created at: 2024-01-01, State: succeeded
...

[DRY RUN] Would have deleted 5 schedules
```

## Error Handling

The script includes comprehensive error handling:
- Validates all required environment variables
- Handles API request failures gracefully
- Continues processing remaining schedules if one fails
- Provides detailed error messages for troubleshooting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Security

- Never commit your `.env` file
- Use environment variables for all sensitive information
- Review the dry-run output before performing actual deletions 