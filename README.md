# Delete Sanity Schedules

A Node.js utility to delete schedules from your Sanity.io project.

## Prerequisites

- Node.js (LTS version recommended)
- Package manager: either pnpm (v10.11.0 or later) or npm
- Sanity project credentials

## Installation

1. Clone the repository:
```bash
git clone https://github.com/jasonb194/deleteSanitySchedules.git
cd deleteSanitySchedules
```

2. Install dependencies:

Using pnpm (recommended):
```bash
pnpm install
```

Using npm:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Sanity credentials:
```env
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=your_dataset
SANITY_TOKEN=your_token
```

## Usage

### Dry Run Mode (Safe Mode) - Default
To preview which schedules would be deleted without actually deleting them:

Using pnpm:
```bash
pnpm start --dry-run=true
```

Using npm:
```bash
npm start -- --dry-run=true
```

### Actual Deletion
To perform the actual deletion of schedules:

Using pnpm:
```bash
pnpm start --dry-run=false
```

Using npm:
```bash
npm start -- --dry-run=false
```

Note: When using npm, you need to add an extra `--` before the arguments.

The script will provide detailed output including:
- Number of schedules found
- Schedule IDs and details
- Deletion status for each schedule
- Summary of operations

## Environment Variables

- `SANITY_PROJECT_ID`: Your Sanity project ID
- `SANITY_DATASET`: The dataset name (usually "production")
- `SANITY_TOKEN`: Your Sanity API token with write permissions

## Dependencies

- `dotenv`: For loading environment variables
- `node-fetch`: For making HTTP requests to Sanity API

## License

MIT
