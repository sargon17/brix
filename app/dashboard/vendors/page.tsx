
import { ListPlus, MoreHorizontal } from "lucide-react";

import { VendorTable } from "./_components/vendor-table";
import {
  Dashboard,
  DashboardActions,
  DashboardContent,
  DashboardHeader,
  DashboardSubtitle,
  DashboardTitle
} from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import CreateRequestForm from "./_components/requests/create-request-form";
import { ButtonGroup } from "@/components/ui/button-group";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";



export default function VendorsPage() {
  return (
    <Dashboard>
      <DashboardHeader
        actionChildren={
          <DashboardActions>
            <ButtonGroup>
              <CreateRequestForm>
                <Button>Request a vendor</Button>
              </CreateRequestForm>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Vendor Requests</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link href={"/dashboard/vendors/requests"}>
                      <DropdownMenuItem>
                        <ListPlus />
                        Past Requests

                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
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
      </DashboardHeader >
      <DashboardContent>
        <VendorTable />
      </DashboardContent>
    </Dashboard >


  );
}
