type DailyWeather = {
  date: string;
  min_c: number;
  max_c: number;
  rain_probability: number;
  summary: string;
};

export function WeatherCard({ forecast, advisory }: { forecast: { current?: { temp_c?: number; summary?: string }; daily?: DailyWeather[] }; advisory: string }) {
  const current = forecast.current || {};
  const daily = forecast.daily || [];

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-savanna-green">Weather</div>
          <div className="mt-2 text-3xl font-bold text-savanna-slate">{current.temp_c ?? '--'}°C</div>
          <div className="mt-1 text-sm text-slate-500">{current.summary || 'Forecast unavailable'}</div>
        </div>
        <div className="rounded-2xl bg-sky-50 px-3 py-2 text-sm font-medium text-sky-900">
          Rain chance {daily[0]?.rain_probability ?? 0}%
        </div>
      </div>
      <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{advisory}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {daily.slice(0, 3).map((day) => (
          <div key={day.date} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm">
            <div className="font-semibold text-slate-700">{day.date}</div>
            <div className="mt-2 text-slate-500">{day.summary}</div>
            <div className="mt-2 font-medium text-savanna-green">{day.min_c}° - {day.max_c}°</div>
          </div>
        ))}
      </div>
    </div>
  );
}