import { Button } from "@/components/ui/button";
import CreateRequestForm from "../_components/requests/create-request-form";
import {
  Dashboard,
  DashboardActions,
  DashboardContent,
  DashboardHeader,
  DashboardSubtitle,
  DashboardTitle,
} from "@/components/dashboard";
import VendorRequestsTable from "./_components/vendor-requests-table";

export default function VendorsPage() {
  return (
    <Dashboard>
      <DashboardHeader
        actionChildren={
          <DashboardActions>
            <CreateRequestForm>
              <Button>Request a vendor</Button>
            </CreateRequestForm>
          </DashboardActions>
        }
      >
        <DashboardTitle>Vendor onboard requests</DashboardTitle>
        <DashboardSubtitle>
          Track all your vendor requests in one place. See every submission
          you’ve made, check its approval status at a glance, and stay updated
          on the progress—so you always know what’s moving forward and what
          needs your attention.
        </DashboardSubtitle>
      </DashboardHeader>
      <DashboardContent>
        <VendorRequestsTable />
      </DashboardContent>
    </Dashboard>
  );
}
