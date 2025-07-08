# Delete Sanity Schedules

A Node.js utility to delete schedules from your Sanity.io project.

## Prerequisites

- Node.js (LTS version recommended)
- PNPM (v10.11.0 or later)
- Sanity project credentials

## Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd deleteSanitySchedules
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the root directory with your Sanity credentials:
```env
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=your_dataset
SANITY_TOKEN=your_token
```

## Usage

### Dry Run Mode (Safe Mode)
To preview which schedules would be deleted without actually deleting them:

```bash
pnpm start --dry-run=true
```

### Actual Deletion
To perform the actual deletion of schedules:

```bash
pnpm start
# or explicitly set dry-run to false
pnpm start --dry-run=false
```

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

ISC

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 