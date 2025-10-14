import "./index.css";
import { useEffect, useState } from "react";

type Flight = {
  id: string;
  airline: string;
  fromCity: string;
  toCity: string;
  departTime: string;
  arriveTime: string;
  price: number;
  duration: string;
  available: boolean;
};

type Hotel = {
  id: string;
  name: string;
  destination: string;
  rating: number;
  pricePerNight: number;
  lateCheckIn: boolean;
  amenities: string[];
  available: boolean;
};

type Weather = {
  city: string;
  forecast: Array<{
    id: string;
    destination: string;
    date: string;
    tempMin: number;
    tempMax: number;
    condition: string;
  }>;
  source?: string;
};

type TripsResponse = {
  version: string;
  flights: { flights: Flight[]; date: string };
  hotels: { hotels: Hotel[]; checkInDate: string };
  weather?: Weather;
  degraded: boolean;
  responseTimeMs: number;
};

type CheapestResponse = {
  version: string;
  selectedFlight: Flight;
  arrivalTime: string;
  needsLateCheckIn: boolean;
  hotels: Hotel[];
};

type Metrics = {
  apiVersionUsage: Record<string, number>;
  v1Percentage: string;
  v2Percentage: string;
  totalRequests: number;
  circuitBreaker: {
    state: string;
    total: number;
    successes: number;
    failures: number;
    failureRate: string;
    openedAt: string | null;
    halfOpenAttempts?: number;
    coolDownMs?: number;
  };
};

export default function App() {
  const [data, setData] = useState<TripsResponse | null>(null);
  const [dataApiError, setDataApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [from, setFrom] = useState("CMB");
  const [to, setTo] = useState("BKK");
  const [date, setDate] = useState("2025-12-10");
  const [version, setVersion] = useState("v1");

  const [currentWindow, setCurrentWindow] = useState<
    "flights" | "cheapest" | "contextual"
  >("flights");

  // contextual state
  type EventItem = {
    id: string;
    name: string;
    destination: string;
    date: string;
    category: string;
    description: string;
    active: boolean;
  };

  type ContextualResponse = {
    version: string;
    destination: string;
    destinationType: string;
    flights: { flights: Flight[]; date: string };
    hotels: { hotels: Hotel[]; checkInDate: string };
    events?: { events: EventItem[]; destination: string };
  };

  const [contextualData, setContextualData] =
    useState<ContextualResponse | null>(null);
  const [contextualLoading, setContextualLoading] = useState(false);
  const [contextualError, setContextualError] = useState<string | null>(null);

  // metrics state
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  // cooldown timer (ms remaining)
  const [cooldownRemaining, setCooldownRemaining] = useState<number | null>(
    null
  );
  // track the last cooldown key we triggered a metrics refresh for
  const [lastCooldownKey, setLastCooldownKey] = useState<string | null>(null);

  function formatMs(ms: number) {
    if (ms <= 0) return "00:00";
    const totalSec = Math.ceil(ms / 1000);
    const min = Math.floor(totalSec / 60)
      .toString()
      .padStart(2, "0");
    const sec = (totalSec % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  }

  const fetchMetrics = async () => {
    try {
      const res = await fetch("http://localhost:3000/metrics");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setMetrics(json as Metrics);
    } catch (err: any) {
      // ignore metrics errors silently for now
      console.warn("fetchMetrics error:", err);
    }
  };

  // watch metrics and start a cooldown timer if circuit is OPEN
  useEffect(() => {
    if (!metrics) {
      setCooldownRemaining(null);
      return;
    }

    const cb = metrics.circuitBreaker;
    if (
      (cb.state === "OPEN" || cb.state === "HALF_OPEN") &&
      cb.openedAt &&
      cb.coolDownMs
    ) {
      const opened = new Date(cb.openedAt).getTime();
      const target = opened + cb.coolDownMs;
      // create a key so we only trigger a single refresh for this particular
      // openedAt+coolDownMs window — prevents fetchMetrics from being called
      // repeatedly when metrics updates keep coming in with the same values.
      const key = `${cb.openedAt}-${cb.coolDownMs}`;

      const update = () => {
        const rem = Math.max(0, target - Date.now());
        setCooldownRemaining(rem);
        // only refresh once per cooldown window
        if (rem <= 0 && lastCooldownKey !== key) {
          setLastCooldownKey(key);
          void fetchMetrics();
        }
      };

      update();
      const t = setInterval(update, 500);
      return () => clearInterval(t);
    }

    setCooldownRemaining(null);
    return;
  }, [metrics]);

  // cheapest-route state
  const [cheapestData, setCheapestData] = useState<CheapestResponse | null>(
    null
  );
  const [cheapestApiError, setCheapestApiError] = useState<string | null>(null);
  const [cheapestLoading, setCheapestLoading] = useState(false);
  const [cheapestError, setCheapestError] = useState<string | null>(null);

  // Build URL from selected values
  const url = `http://localhost:3000/${version}/trips/search?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`;

  const fetchTrips = () => {
    // keep compatibility for manual Search button — run a simple fetch without Abort handling
    setLoading(true);
    setError(null);
    setDataApiError(null);
    setData(null);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: any) => {
        if (json && typeof json === "object" && "error" in json) {
          setDataApiError(String(json.error));
          return;
        }
        setData(json as TripsResponse);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
        void fetchMetrics();
      });
  };

  // useEffect fetch with AbortController to cancel in-flight request on unmount
  useEffect(() => {
    // only auto-run the search if the Flights tab is active
    if (currentWindow !== "flights") return;

    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    setError(null);
    setDataApiError(null);
    setData(null);

    fetch(url, { signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: any) => {
        if (signal.aborted) return;
        if (json && typeof json === "object" && "error" in json) {
          setDataApiError(String(json.error));
          return;
        }
        setData(json as TripsResponse);
      })
      .catch((err: any) => {
        if (err.name === "AbortError") return; // expected during cleanup
        setError(err.message);
      })
      .finally(() => {
        if (signal.aborted) return;
        setLoading(false);
        void fetchMetrics();
      });

    return () => controller.abort();
  }, [url, currentWindow]);

  const fetchCheapest = async (signal?: AbortSignal) => {
    setCheapestLoading(true);
    setCheapestError(null);
    setCheapestApiError(null);
    setCheapestData(null);
    const cheapestUrl = `http://localhost:3000/v1/trips/cheapest-route?from=${encodeURIComponent(
      from
    )}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`;

    try {
      const res = await fetch(
        cheapestUrl,
        signal ? { signal } : (undefined as any)
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: any = await res.json();
      if (json && typeof json === "object" && "error" in json) {
        setCheapestApiError(String(json.error));
      } else {
        setCheapestData(json as CheapestResponse);
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setCheapestError(err?.message ?? String(err));
    } finally {
      setCheapestLoading(false);
      // refresh metrics after request
      void fetchMetrics();
    }
  };

  const fetchContextual = async (signal?: AbortSignal) => {
    setContextualLoading(true);
    setContextualError(null);
    setContextualData(null);

    const ctxUrl = `http://localhost:3000/v1/trips/contextual?from=${encodeURIComponent(
      from
    )}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`;

    try {
      const res = await fetch(ctxUrl, signal ? { signal } : (undefined as any));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: any = await res.json();
      if (json && typeof json === "object" && "error" in json) {
        setContextualError(String(json.error));
      } else {
        setContextualData(json as ContextualResponse);
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setContextualError(err?.message ?? String(err));
    } finally {
      setContextualLoading(false);
      // refresh metrics after request
      void fetchMetrics();
    }
  };

  return (
    <div className="app-root m-auto max-w-4xl bg-amber-200 p-6 text-black">
      <header className="w-full flex justify-center items-center mb-4">
        <h1 className="text-2xl font-bold">Travel Planner</h1>
      </header>

      <main>
        <section className="mb-4 flex justify-center gap-4">
          <button
            className={`px-4 py-2 rounded ${
              currentWindow === "flights"
                ? "bg-amber-400 text-white"
                : "bg-white/60"
            }`}
            onClick={() => setCurrentWindow("flights")}
          >
            Flights
          </button>
          <button
            className={`px-4 py-2 rounded ${
              currentWindow === "cheapest"
                ? "bg-amber-400 text-white"
                : "bg-white/60"
            }`}
            onClick={() => {
              setCurrentWindow("cheapest");
              fetchCheapest();
            }}
          >
            Cheapest Trip
          </button>
          <button
            className={`px-4 py-2 rounded ${
              currentWindow === "contextual"
                ? "bg-amber-400 text-white"
                : "bg-white/60"
            }`}
            onClick={() => {
              setCurrentWindow("contextual");
              fetchContextual();
            }}
          >
            Contextual
          </button>
        </section>

        {currentWindow === "flights" && (
          <section className="">
            <section className="mb-4 bg-white/60 p-4 rounded shadow">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // fetch is driven by url changes via state
                }}
                className="flex flex-wrap gap-4 justify-between items-end"
              >
                <div className="flex flex-col">
                  <label className="text-sm">From</label>
                  <select
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="px-2 py-1"
                  >
                    <option value="CMB">CMB</option>
                    <option value="BKK">BKK</option>
                    <option value="DEL">DEL</option>
                    <option value="SIN">SIN</option>
                    <option value="KUL">KUL</option>
                    <option value="MNL">MNL</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm">To</label>
                  <select
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="px-2 py-1"
                  >
                    <option value="BKK">BKK</option>
                    <option value="CMB">CMB</option>
                    <option value="KUL">KUL</option>
                    <option value="MNL">MNL</option>
                    <option value="DEL">DEL</option>
                    <option value="SIN">SIN</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="px-2 py-1"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm">API Version</label>
                  <select
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="px-2 py-1"
                  >
                    <option value="v1">v1</option>
                    <option value="v2">v2</option>
                  </select>
                </div>

                <div>
                  <button
                    type="submit"
                    className="bg-amber-400 px-3 py-1 rounded hover:bg-amber-500"
                    onClick={() => {
                      fetchTrips();
                    }}
                  >
                    Search
                  </button>
                </div>
              </form>
            </section>

            {loading && (
              <div className="space-y-4">
                <div className="p-4 bg-white/60 rounded">Loading trips…</div>
                <div className="grid gap-3">
                  {/* flights skeleton */}
                  <div className="p-3 rounded animate-pulse bg-gray-200 h-20" />
                  <div className="p-3 rounded animate-pulse bg-gray-200 h-20" />
                  {/* hotels skeleton */}
                  <div className="p-3 rounded animate-pulse bg-gray-200 h-20" />
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-200 text-red-900 rounded">
                Error: {error}
              </div>
            )}

            {dataApiError && (
              <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
                {dataApiError}
              </div>
            )}

            {!loading && !error && !dataApiError && data && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Trips for {data.flights.date}
                  </h2>
                  {data.degraded && (
                    <span className="text-sm text-yellow-800 bg-yellow-300 px-2 py-1 rounded">
                      Degraded mode
                    </span>
                  )}
                </div>

                <section className="bg-white/60 p-4 rounded">
                  <h3 className="font-semibold mb-2">Flights</h3>
                  <div className="grid gap-3">
                    {data.flights.flights.map((f) => (
                      <div
                        key={f.id}
                        className="p-3 border rounded flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium">{f.airline}</div>
                          <div className="text-sm text-gray-700">
                            {f.fromCity} → {f.toCity} • {f.duration}
                          </div>
                          <div className="text-sm">
                            {f.departTime} — {f.arriveTime}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${f.price}</div>
                          <div
                            className={`text-sm ${
                              f.available ? "text-green-700" : "text-gray-500"
                            }`}
                          >
                            {f.available ? "Available" : "Sold out"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-white/60 p-4 rounded">
                  <h3 className="font-semibold mb-2">
                    Hotels (check in {data.hotels.checkInDate})
                  </h3>
                  <div className="grid gap-3">
                    {data.hotels.hotels.map((h) => (
                      <div
                        key={h.id}
                        className="p-3 border rounded flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium">{h.name}</div>
                          <div className="text-sm text-gray-700">
                            {h.destination} • {h.rating} ★
                          </div>
                          <div className="text-sm">
                            Amenities: {h.amenities.join(", ")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ${h.pricePerNight}/nt
                          </div>
                          <div
                            className={`text-sm ${
                              h.available ? "text-green-700" : "text-gray-500"
                            }`}
                          >
                            {h.available
                              ? h.lateCheckIn
                                ? "Available • Late check-in"
                                : "Available"
                              : "Unavailable"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Weather block for v2 responses */}
                {data.version === "v2" && data.weather && (
                  <section className="bg-white/60 p-4 rounded">
                    <h3 className="font-semibold mb-2">
                      Weather — {data.weather.city}
                    </h3>
                    <div className="grid gap-2">
                      {data.weather.forecast.map((w) => (
                        <div
                          key={w.id}
                          className="p-2 border rounded flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium">
                              {w.date} — {w.condition}
                            </div>
                            <div className="text-sm text-gray-700">
                              {w.destination}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {w.tempMin}° / {w.tempMax}°
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {data.weather.source && (
                      <div className="text-xs text-gray-500 mt-2">
                        Source: {data.weather.source}
                      </div>
                    )}
                  </section>
                )}

                <section className="text-sm text-gray-700">
                  <div>Response time: {data.responseTimeMs} ms</div>
                  <div className="mt-2">Raw version: {data.version}</div>
                </section>
              </div>
            )}
          </section>
        )}

        {currentWindow === "cheapest" && (
          <section>
            <div className="p-4 bg-white/60 rounded">
              {/* controls inside cheapest tab (same state as flights) */}
              <div className="mb-4 bg-white/40 p-3 rounded">
                <div className="flex flex-wrap gap-3 justify-between">
                  <div className="flex flex-col">
                    <label className="text-sm">From</label>
                    <select
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="px-2 py-1"
                    >
                      <option value="CMB">CMB</option>
                      <option value="BKK">BKK</option>
                      <option value="DEL">DEL</option>
                      <option value="SIN">SIN</option>
                      <option value="KUL">KUL</option>
                      <option value="MNL">MNL</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm">To</label>
                    <select
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="px-2 py-1"
                    >
                      <option value="BKK">BKK</option>
                      <option value="CMB">CMB</option>
                      <option value="KUL">KUL</option>
                      <option value="MNL">MNL</option>
                      <option value="DEL">DEL</option>
                      <option value="SIN">SIN</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="px-2 py-1"
                    />
                  </div>

                  <div className="flex flex-col mt-3">
                    <button
                      className="bg-amber-400 px-3 py-1 rounded"
                      onClick={() => fetchCheapest()}
                    >
                      Find Cheapest
                    </button>
                  </div>
                </div>
              </div>

              {cheapestLoading && (
                <div className="space-y-2">
                  <div className="p-3 rounded animate-pulse bg-gray-200 h-16" />
                  <div className="p-3 rounded animate-pulse bg-gray-200 h-16" />
                </div>
              )}

              {cheapestError && (
                <div className="p-3 bg-red-100 text-red-800 rounded">
                  {cheapestError}
                </div>
              )}

              {cheapestApiError && (
                <div className="p-3 bg-yellow-50 text-yellow-800 rounded">
                  {cheapestApiError}
                </div>
              )}

              {cheapestData && !cheapestApiError && (
                <div className="space-y-4">
                  <div className="p-3 border rounded">
                    <h3 className="font-semibold">Selected Flight</h3>
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <div className="font-medium">
                          {cheapestData.selectedFlight.airline}
                        </div>
                        <div className="text-sm text-gray-700">
                          {cheapestData.selectedFlight.fromCity} →{" "}
                          {cheapestData.selectedFlight.toCity}
                        </div>
                        <div className="text-sm">
                          {cheapestData.selectedFlight.departTime} —{" "}
                          {cheapestData.selectedFlight.arriveTime}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          ${cheapestData.selectedFlight.price}
                        </div>
                        <div className="text-sm">
                          Arrival {cheapestData.arrivalTime}
                        </div>
                        <div className="text-sm">
                          {cheapestData.needsLateCheckIn
                            ? "Needs late check-in"
                            : "No late check-in required"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border rounded">
                    <h3 className="font-semibold mb-2">Hotels</h3>
                    <div className="grid gap-3">
                      {cheapestData.hotels.map((h) => (
                        <div
                          key={h.id}
                          className="p-2 border rounded flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium">{h.name}</div>
                            <div className="text-sm text-gray-700">
                              {h.destination} • {h.rating} ★
                            </div>
                            <div className="text-sm">
                              Amenities: {h.amenities.join(", ")}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              ${h.pricePerNight}/nt
                            </div>
                            <div
                              className={`text-sm ${
                                h.available ? "text-green-700" : "text-gray-500"
                              }`}
                            >
                              {h.available
                                ? h.lateCheckIn
                                  ? "Available • Late check-in"
                                  : "Available"
                                : "Unavailable"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {currentWindow === "contextual" && (
          <section>
            <div className="p-4 bg-white/60 rounded">
              <h2 className="text-xl font-semibold mb-4">Contextual Results</h2>

              <div className="mb-4">
                <div className="flex gap-3 items-center">
                  <div className="flex flex-col">
                    <label className="text-sm">From</label>
                    <select
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="px-2 py-1"
                    >
                      <option value="CMB">CMB</option>
                      <option value="BKK">BKK</option>
                      <option value="DEL">DEL</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm">To</label>
                    <select
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="px-2 py-1"
                    >
                      <option value="HKT">HKT</option>
                      <option value="BKK">BKK</option>
                      <option value="CMB">CMB</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="px-2 py-1"
                    />
                  </div>
                  <div>
                    <button
                      className="bg-amber-400 px-3 py-1 rounded"
                      onClick={() => fetchContextual()}
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              {contextualLoading && (
                <div className="space-y-2">
                  <div className="p-3 rounded animate-pulse bg-gray-200 h-16" />
                  <div className="p-3 rounded animate-pulse bg-gray-200 h-16" />
                </div>
              )}

              {contextualError && (
                <div className="p-3 bg-red-100 text-red-800 rounded">
                  {contextualError}
                </div>
              )}

              {contextualData && (
                <div className="space-y-4">
                  <div className="p-3 border rounded">
                    <h3 className="font-semibold">
                      Flights to {contextualData.destination} (
                      {contextualData.destinationType})
                    </h3>
                    <div className="mt-2 grid gap-2">
                      {contextualData.flights.flights.map((f) => (
                        <div
                          key={f.id}
                          className="p-2 border rounded flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium">{f.airline}</div>
                            <div className="text-sm text-gray-700">
                              {f.fromCity} → {f.toCity}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${f.price}</div>
                            <div className="text-sm">
                              {f.departTime} — {f.arriveTime}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 border rounded">
                    <h3 className="font-semibold">
                      Hotels (check in {contextualData.hotels.checkInDate})
                    </h3>
                    <div className="grid gap-3 mt-2">
                      {contextualData.hotels.hotels.map((h) => (
                        <div
                          key={h.id}
                          className="p-2 border rounded flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium">{h.name}</div>
                            <div className="text-sm text-gray-700">
                              {h.destination} • {h.rating} ★
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              ${h.pricePerNight}/nt
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {contextualData.events && (
                    <div className="p-3 border rounded">
                      <h3 className="font-semibold">
                        Events in {contextualData.destination}
                      </h3>
                      <div className="grid gap-2 mt-2">
                        {contextualData.events.events.map((ev) => (
                          <div key={ev.id} className="p-2 border rounded">
                            <div className="font-medium">
                              {ev.name} — {ev.category}
                            </div>
                            <div className="text-sm text-gray-700">
                              {ev.date} • {ev.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-6 w-full text-center">
        <small>Travel Planner 360.</small>
      </footer>
      {/* Metrics floating card (bottom-right) */}
      <div className="fixed right-4 bottom-4 w-72">
        <div className="bg-white/90 p-3 rounded shadow-lg">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Metrics</div>
            <div className="text-xs text-gray-600">Live</div>
          </div>
          {metrics ? (
            <div className="mt-2 text-sm">
              <div>Requests: {metrics.totalRequests}</div>
              <div className="mt-1">
                v1: {metrics.apiVersionUsage.v1 ?? 0} ({metrics.v1Percentage})
              </div>
              <div>
                v2: {metrics.apiVersionUsage.v2 ?? 0} ({metrics.v2Percentage})
              </div>
              <div className="mt-2 font-medium">
                Circuit: {metrics.circuitBreaker.state}
              </div>
              <div className="text-xs text-gray-600">
                Failures: {metrics.circuitBreaker.failures} /{" "}
                {metrics.circuitBreaker.total}
              </div>
              {(metrics.circuitBreaker.state === "OPEN" ||
                metrics.circuitBreaker.state === "HALF_OPEN") &&
                cooldownRemaining !== null && (
                  <div className="mt-2 text-sm text-red-600">
                    {metrics.circuitBreaker.state === "OPEN" &&
                      `Cooldown: ${formatMs(cooldownRemaining)}`}
                  </div>
                )}
            </div>
          ) : (
            <div className="mt-2 text-sm text-gray-600">No metrics</div>
          )}
        </div>
      </div>
    </div>
  );
}
