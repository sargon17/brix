import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardSubtitle,
  DashboardTitle,
} from "@/components/dashboard";

import VendorRequestsTable from "./_components/vendor-request-table";

export default function VendorsPage() {
  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardTitle>Vendor onboard requests</DashboardTitle>
        <DashboardSubtitle>
          Review and manage vendor onboarding requests. As an admin, you can see
          all submissions, approve or reject them, and keep the process moving
          smoothly.
        </DashboardSubtitle>
      </DashboardHeader>
      <DashboardContent>
        <VendorRequestsTable />
      </DashboardContent>
    </Dashboard>
  );
}
