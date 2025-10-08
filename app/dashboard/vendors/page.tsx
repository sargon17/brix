import { Dashboard, DashboardActions, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle } from "@/components/dashboard";

import { VendorTable } from "./_components/vendor-table";
import { Button } from "@/components/ui/button";
import CreateRequestForm from "./_components/requests/create-request-form";



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
        <DashboardTitle>
          Vendors
        </DashboardTitle>
        <DashboardSubtitle>
          Construction Pro Inc.&apos;s active catalog. Review intake requests,
          supplier health, and key contacts in one place to keep procurement
          decisions moving.
        </DashboardSubtitle>
      </DashboardHeader>
      <DashboardContent>
        <VendorTable />
      </DashboardContent>
    </Dashboard>


  );
}
