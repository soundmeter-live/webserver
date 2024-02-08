'use client';
import { useMemo } from 'react';

import { useApiQuery } from '@/query';
import { AxiosError } from 'axios';

const MAX_DISPLAY_SPL = 115;

const Points = () => {
  const { isPending, isError, isFetching, data, error } = useApiQuery(
    '/api/points',
    null,
    {
      refetchInterval: 5000,
    },
  );
  if (isError)
    console.log(((error as AxiosError).response?.data as any)?.error ?? error);

  const points = useMemo(() => {
    let p = (
      data as
        | {
            points: {
              id: string;
              timeAt: number;
              value: number;
            }[];
          }
        | undefined
    )?.points;
    if (p) {
      p.sort((a, b) => b.timeAt - a.timeAt);
      return p.map((it) => ({
        ...it,
        date: new Date(it.timeAt * 1000),
      }));
    }
  }, [data]);

  return (
    <>
      <div className="container relative mx-auto flex flex-col gap-4 rounded-3xl bg-zinc-800 p-4 sm:rounded-2xl sm:p-8">
        <h2 className="border-b border-b-zinc-700 px-2 py-2 text-xl font-bold">
          Points
        </h2>
        {/* loading state */}
        <div className="absolute right-4 top-4 text-right text-sm opacity-80">
          {isPending && (
            <div className="text-amber-500">waiting for initial load</div>
          )}
          {isError && <div className="text-red-500">request failed</div>}
          {isFetching && <div className="text-amber-300">(loading data)</div>}
        </div>

        {/* data */}
        <div className="rounded-xl bg-zinc-900">
          <table className="w-full table-auto">
            {/* table headers */}
            <thead className="border-b-2 border-b-zinc-100/10">
              <tr className="">
                {['Time', 'Value'].map((it, k) => (
                  <th
                    key={k}
                    className="pb-2 pt-4 text-left first:pl-6 last:pr-6"
                  >
                    {it}
                  </th>
                ))}
                <th className="w-20 sm:w-48 lg:w-96"></th>
              </tr>
            </thead>
            {/* table body */}
            <tbody className="text-sm">
              {points?.map((pt) => (
                <tr
                  key={pt.id}
                  className="border-b border-b-zinc-100/10 last:border-0 "
                >
                  <td className="p-2 text-zinc-400 first:pl-6 last:pr-6">
                    <span className="text-zinc-100">
                      {pt.date.getFullYear()}/{pt.date.getMonth()}/
                      {pt.date.getDate()}
                    </span>
                    {' - '}
                    <span className="text-zinc-100/80">
                      {('00' + pt.date.getHours()).slice(-2)}:
                      {('00' + pt.date.getMinutes()).slice(-2)}:
                      {('00' + pt.date.getSeconds()).slice(-2)}
                    </span>
                  </td>
                  <td className="p-2 first:pl-6 last:pr-6">
                    {Math.round(pt.value * 100) / 100} dB
                  </td>

                  <td className="relative">
                    <div className="absolute left-0 top-0 flex h-full w-full flex-row p-2">
                      <div className="flex-1 overflow-hidden rounded-md">
                        <div
                          className="select-none bg-sky-600"
                          style={{
                            width: `${(pt.value / MAX_DISPLAY_SPL) * 100}%`,
                          }}
                        >
                          &nbsp;
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {!points?.length && (
                <tr className="">
                  <td className="px-6 py-2 text-sm italic opacity-50">
                    no data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default Points;
