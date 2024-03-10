import { fetchFilteredCustomers } from "@/app/lib/data";
import Table from "@/app/ui/customers/table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Customers',
  description: 'Page with the customers overview'
}

export default async function Page({
  searchParams
}: {
  searchParams?: {
    query?: string,
    page?: string;
  }
}) {
  const customers = await fetchFilteredCustomers(searchParams?.query || '');
  return (
    <div className="w-full">
      <Table customers={customers} />
    </div>
  );
}