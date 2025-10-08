import { Button } from "@/components/ui/button";

import {
  Dashboard,
  DashboardActions,
  DashboardContent,
  DashboardHeader,
  DashboardSubtitle,
  DashboardTitle
} from "@/components/dashboard";

export default function VendorsPage() {
  return (
    <Dashboard>
      <DashboardHeader
      >
        <DashboardTitle>
          Vendor onboard requests
        </DashboardTitle>
        <DashboardSubtitle>
          Review and manage vendor onboarding requests.
          As an admin, you can see all submissions,
          approve or reject them, and keep the process moving smoothly.
        </DashboardSubtitle>
      </DashboardHeader >
      <DashboardContent>
        {/* <VendorRequestsTable /> */}
      </DashboardContent>
    </Dashboard >


  );
}
