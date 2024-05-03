import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center">
        <Link href="/" className="p-2 text-red-600 hover:underline">
          not found
        </Link>
      </div>
    </>
  );
}
