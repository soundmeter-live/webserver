'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { DateTime as luxon } from 'luxon';
import type { AxiosError } from 'axios';

import { useGraphQuery } from '@/query';
import { GET_LEVEL_POINTS_AFTER_DATE } from '@/gql/queries';

const MAX_DISPLAY_SPL = 115;
const REFRESH_RATE_MS = 8000;
const TEXT_DEBOUNCE_SEC = 0.8;
const DEFAULT_HOURS = 24;

const digit = (a: number | string) => ('00' + a).slice(-2);
const hoursAgo = (hours: number) => luxon.now().minus({ hours }).toSeconds();

const Points = () => {
  // number of hours
  const [sinceTime, setSinceTime] = useState(
    Math.round(hoursAgo(DEFAULT_HOURS)),
  );
  const [hoursInput, setHoursInput] = useState('' + DEFAULT_HOURS);
  const hoursBox = useRef<HTMLSpanElement>(null);
  const [hoursWidth, setHoursWidth] = useState(26);
  // update hours request value (debounced)
  useEffect(() => {
    let w;
    if ((w = hoursBox.current?.offsetWidth)) setHoursWidth(w);

    const tm = setTimeout(() => {
      let h = parseFloat(hoursInput);
      if (Number.isFinite(h)) {
        if (h > 1e9) h = 1e9;
        let st = hoursAgo(h);
        if (st < 0) st = 0;
        setSinceTime(Math.round(st));
      }
    }, TEXT_DEBOUNCE_SEC * 1000);
    return () => clearTimeout(tm);
  }, [hoursInput]);
  // update hours textbox
  const updateHoursInput = ({
    currentTarget: { value },
  }: ChangeEvent<HTMLInputElement>) =>
    setHoursInput((value.match(/[\d\.]/g) || ['']).join('').slice(0, 10));

  // server data query
  const { isPending, isError, isFetching, data, error } = useGraphQuery(
    GET_LEVEL_POINTS_AFTER_DATE,
    { after: sinceTime },
    { refetchInterval: REFRESH_RATE_MS, retry: (attempts) => attempts < 5 },
  );

  if (isError)
    console.log(((error as AxiosError).response?.data as any)?.error ?? error);

  const points = useMemo(() => {
    let p = data?.levelPointsAfterDate;
    if (p) {
      p.sort((a, b) => b!.timeAt - a!.timeAt);
      return p.map((it) => ({
        ...it,
        date: new Date(it!.timeAt * 1000),
      }));
    }
  }, [data]);

  return (
    <>
      <div className="container mx-auto flex flex-col gap-4 rounded-3xl bg-zinc-800 p-4 sm:rounded-2xl sm:p-8">
        {/* component header */}
        <div className="flex flex-row justify-between gap-4 border-b border-b-zinc-700 px-2 py-2">
          <h2 className="text-xl font-bold sm:mr-2">Points</h2>
          {/* hours selector */}
          <div className="flex flex-row items-center gap-2.5">
            <label htmlFor="hours" className="flex-1 text-right text-sm">
              data within the last
              <span className="sr-only"> blank hours</span>
            </label>
            <input
              id="hours"
              type="text"
              value={hoursInput}
              onChange={updateHoursInput}
              className="-m-1.5 rounded-md border-0 bg-transparent p-1.5 outline-0 hover:bg-zinc-900/50 focus:bg-zinc-900"
              style={{ width: hoursWidth + 6 * 2 }}
            />
            <span ref={hoursBox} className="invisible absolute">
              {hoursInput}
            </span>
            <div className="text-sm">
              hour{parseFloat(hoursInput) !== 1 && 's'}
            </div>
          </div>
        </div>
        {/* loading state */}
        <div className="fixed right-4 top-4 text-right text-sm opacity-80">
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
                  {/* time element */}
                  <td className="p-2 pl-6 text-zinc-400">
                    <span className="text-zinc-100">
                      {pt.date.getFullYear()}/{digit(pt.date.getMonth() + 1)}/
                      {digit(pt.date.getDate())}
                    </span>
                    <span className="t"> - </span>
                    <span className="text-zinc-100/80">
                      {digit(pt.date.getHours())}:{digit(pt.date.getMinutes())}:
                      {digit(pt.date.getSeconds())}
                    </span>
                    <span className="hidden sm:inline">
                      {' - '}
                      {luxon.fromSeconds(pt.timeAt).toRelative()}
                    </span>
                  </td>

                  {/* value element */}
                  <td className="p-2 ">
                    <span className="">{Math.round(pt.value * 100) / 100}</span>
                    <span className="select-none"> dB</span>
                  </td>

                  {/* graph element */}
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
              {/* if no data is found */}
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
