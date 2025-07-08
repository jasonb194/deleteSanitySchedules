import {getCliClient} from '@sanity/cli'

interface SanityDocument {
  documentId: string;
  documentType: string;
}

interface SanitySchedule {
  id: string;
  createdAt: string;
  executeAt: string;
  executedAt: string;
  state: string;
  documents: SanityDocument[];
}

interface SchedulesResponse {
  schedules: SanitySchedule[];
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.find((arg: string) => arg.startsWith('--dry-run='))
  ? args.find((arg: string) => arg.startsWith('--dry-run='))!.split('=')[1] !== 'false'
  : true; // Default to dry-run mode if not specified
const days = args.find((arg: string) => arg.startsWith('--days='))
  ? parseInt(args.find((arg: string) => arg.startsWith('--days='))!.split('=')[1])
  : 90;
const state = args.find((arg: string) => arg.startsWith('--state='))
  ? args.find((arg: string) => arg.startsWith('--state='))!.split('=')[1]
  : 'succeeded';

// Create Sanity client
const client = getCliClient();
const { projectId, dataset } = client.config();

console.log('Configuration loaded:');
console.log('- Project ID:', projectId);
console.log('- Dataset:', dataset);
console.log('- Dry run mode:', dryRun ? 'enabled (will not delete)' : 'disabled (will delete)');
console.log('- State filter:', state);

async function fetchCompletedSchedules(): Promise<SanitySchedule[]> {
  try {
    const data = await client.request<SchedulesResponse>({
      url: `/schedules/${projectId}/${dataset}`,
      query: {
        tag: 'sanity.studio',
        state: state,
        limit: '1000'
      }
    });
    
    // Filter schedules older than 90 days based on executedAt
    const checkDate = new Date();
    checkDate.setDate(checkDate.getDate() - days);
    console.log('Fetched Schedules', data.schedules.length);
    return data.schedules.filter(schedule => {
      const executionDate = new Date(schedule.executedAt);
      return executionDate < checkDate;
    });
  } catch (error) {
    console.error('Error fetching completed schedules:', error);
    throw error;
  }
}

async function deleteSchedule(scheduleId: string): Promise<void> {
  if (dryRun) {
    console.log(`[DRY RUN] Would delete schedule: ${scheduleId}`);
    return;
  }

  try {
    await client.request({
      method: 'DELETE',
      url: `/schedules/${projectId}/${dataset}/${scheduleId}`
    });

    console.log(`Successfully deleted schedule: ${scheduleId}`);
  } catch (error) {
    console.error(`Error deleting schedule ${scheduleId}:`, error);
    throw error;
  }
}

async function main(): Promise<void> {
  try {
    console.log('Fetching completed schedules...');
    const completedSchedules = await fetchCompletedSchedules();
    console.log(`Found ${completedSchedules.length} schedules completed more than ${days} ${days === 1 ? 'day' : 'days'} ago`);
    
    // Log the schedules for inspection
    completedSchedules.forEach((schedule) => {
      const documents = schedule.documents.map(doc => 
        `${doc.documentType} (${doc.documentId})`
      ).join(', ');
      
      console.log(
        `Schedule ID: ${schedule.id}\n` +
        `  Documents: ${documents}\n` +
        `  Created: ${schedule.createdAt}\n` +
        `  Execute At: ${schedule.executeAt}\n` +
        `  Executed At: ${schedule.executedAt}\n` +
        `  State: ${schedule.state}\n`
      );
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
      console.log('sanity exec dist/deleteSchedules.js --with-user-token -- --dry-run=false');
    } else {
      console.log(`\nDeletion complete. Successfully deleted: ${successCount}, Failed: ${failureCount}`);
    }
  } catch (error) {
    console.error('Script failed:', error);
  }
}

main(); 