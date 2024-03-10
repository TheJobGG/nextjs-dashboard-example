import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <main className="relative flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <span className='select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl md:text-[224px] xl:text-[352px] text-gray-100 font-extrabold -z-30'>
        404
      </span>
      <h2 className="text-xl font-semibold">Not Found</h2>
      <p>Could not find the requested invoice.</p>
      <Link
        href="/dashboard/invoices"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Go Back
      </Link>
    </main>
  );
}