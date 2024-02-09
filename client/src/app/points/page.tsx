import Link from 'next/link';
import Points from './_components/Points';

export default function PointsPage() {
  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="p-6 text-center text-3xl">SoundMeter</div>
        <div className="flex-1 p-2">
          <Points />
        </div>
        <div className="mt-8 bg-zinc-950 px-8 py-2 text-right text-sm text-zinc-300">
          <Link href="/" className="opacity-80 hover:opacity-100">
            soundmeter.live
          </Link>
        </div>
      </div>
    </>
  );
}
