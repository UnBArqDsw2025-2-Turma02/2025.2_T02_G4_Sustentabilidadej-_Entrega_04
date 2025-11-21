const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const cron = require('node-cron');
const { sendScheduledMonthlyReports } = require('./services/emailService');

const PORT = process.env.PORT || 3001;

// Schedule monthly reports (default: 1st day 08:00)
const schedule = process.env.REPORT_CRON_SCHEDULE || '0 8 1 * *';
try {
  cron.schedule(schedule, async () => {
    try {
      await sendScheduledMonthlyReports();
      console.log(`[cron] Monthly reports sent at ${new Date().toISOString()}`);
    } catch (err) {
      console.error('[cron] Error sending monthly reports:', err);
    }
  });
  console.log(`[cron] Scheduler started with pattern: ${schedule}`);
} catch (e) {
  console.error('[cron] Failed to start scheduler. Check REPORT_CRON_SCHEDULE format.', e.message);
}

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
