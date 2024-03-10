import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Customers',
  description: 'Page with the customers overview'
}

export default function Page() {
  return <p className="text-2xl text-center">Customers Page</p>;
}