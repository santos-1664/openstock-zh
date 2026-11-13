import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { emailAlertsEnabled } from "@/lib/market-data";
import { sendWeeklyNewsSummary, sendSignUpEmail, checkStockAlerts, checkInactiveUsers } from "@/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
    client: inngest,
    // Only register the email checker when email delivery and its scheduler are explicitly enabled.
    functions: [sendSignUpEmail, sendWeeklyNewsSummary, checkInactiveUsers, ...(emailAlertsEnabled ? [checkStockAlerts] : [])],
})
