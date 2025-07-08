const dotenv = require('dotenv');
const fetch = require('node-fetch');

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.find(arg => arg.startsWith('--dry-run='))
  ? args.find(arg => arg.startsWith('--dry-run=')).split('=')[1] !== 'false'
  : true; // Default to dry-run mode if not specified

// Load environment variables
dotenv.config();

// Debug: Check if all required environment variables are present
const token = process.env.SANITY_API_TOKEN;
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;

// Validate all required environment variables
const missingVars = [];
if (!token) missingVars.push('SANITY_API_TOKEN');
if (!projectId) missingVars.push('SANITY_STUDIO_PROJECT_ID');
if (!dataset) missingVars.push('SANITY_STUDIO_DATASET');

if (missingVars.length > 0) {
  console.error('Error: Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

console.log('Environment variables loaded:');
console.log('- Token is present (first 4 characters):', token.substring(0, 4));
console.log('- Project ID:', projectId);
console.log('- Dataset:', dataset);
console.log('- Dry run mode:', dryRun ? 'enabled (will not delete)' : 'disabled (will delete)');

async function fetchCompletedSchedules() {
  try {
    const apiUrl = `https://api.sanity.io/v2022-09-01/schedules/${projectId}/${dataset}?tag=sanity.studio&state=succeeded&limit=1000`;
    console.log('Fetching schedules from:', apiUrl);
    
    const response = await fetch(
      apiUrl,
      {
        headers: {
          'Authorization': `Bearer ${process.env.SANITY_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API request failed with status ${response.status}. Response: ${errorBody}`);
    }

    const data = await response.json();
    return data.schedules;
  } catch (error) {
    console.error('Error fetching completed schedules:', error);
    throw error;
  }
}

async function deleteSchedule(scheduleId) {
  if (dryRun) {
    console.log(`[DRY RUN] Would delete schedule: ${scheduleId}`);
    return;
  }

  try {
    const response = await fetch(
      `https://api.sanity.io/v2022-09-01/schedules/${projectId}/${dataset}/${scheduleId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.SANITY_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete schedule ${scheduleId} with status ${response.status}`);
    }

    console.log(`Successfully deleted schedule: ${scheduleId}`);
  } catch (error) {
    console.error(`Error deleting schedule ${scheduleId}:`, error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Fetching completed schedules...');
    const completedSchedules = await fetchCompletedSchedules();
    console.log(`Found ${completedSchedules.length} completed schedules`);
    
    // Log the schedules for inspection
    completedSchedules.forEach((schedule) => {
      console.log(`Schedule ID: ${schedule.id}, Created at: ${schedule.createdAt}, State: ${schedule.state}`);
    });

    if (completedSchedules.length === 0) {
      console.log('No schedules to delete.');
      return;
    }

    // Delete each schedule
    console.log(`\n${dryRun ? '[DRY RUN] ' : ''}Starting deletion of completed schedules...`);
    let successCount = 0;
    let failureCount = 0;

    for (const schedule of completedSchedules) {
      try {
        await deleteSchedule(schedule.id);
        successCount++;
      } catch (error) {
        failureCount++;
        // Continue with other deletions even if one fails
        console.error(`Failed to delete schedule ${schedule.id}. Continuing with remaining schedules...`);
      }
    }

    if (dryRun) {
      console.log(`\n[DRY RUN] Would have deleted ${completedSchedules.length} schedules`);
      console.log('\nTo perform the actual deletion, run:');
      console.log('node deleteSchedules.js --dry-run=false');
    } else {
      console.log(`\nDeletion complete. Successfully deleted: ${successCount}, Failed: ${failureCount}`);
    }
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

main(); 