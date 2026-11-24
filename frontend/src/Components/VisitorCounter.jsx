import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const BASE_INITIAL_COUNT = 125143;

// In-flight request cache to prevent duplicate calls during React StrictMode or fast navigation
let inFlightRequest = null;

/**
 * Retrieves an existing visitor ID or generates a new unique UUID.
 * Stored persistently in localStorage and cookie for maximum cross-session resilience.
 */
const getOrCreateVisitorId = () => {
  if (typeof window === 'undefined') return 'server_side_fallback';

  try {
    let id = localStorage.getItem('itu_visitor_id');
    if (!id) {
      // Check cookie fallback
      const cookieMatch = document.cookie.match(/(?:^|; )itu_visitor_id=([^;]*)/);
      if (cookieMatch) {
        id = decodeURIComponent(cookieMatch[1]);
      }
    }

    if (!id) {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        id = crypto.randomUUID();
      } else {
        id = 'vid_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
      }
    }

    // Persist in localStorage and 1-year cookie
    localStorage.setItem('itu_visitor_id', id);
    document.cookie = `itu_visitor_id=${encodeURIComponent(id)}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;

    return id;
  } catch {
    return 'anonymous_visitor';
  }
};

const VisitorCounter = () => {
  // Synchronously initialize with cached count or base count (1,25,143) to prevent layout shift (CLS = 0)
  const [count, setCount] = useState(() => {
    if (typeof window === 'undefined') return BASE_INITIAL_COUNT;
    try {
      const cached = localStorage.getItem('itu_cached_visitor_count');
      const parsed = parseInt(cached, 10);
      return !isNaN(parsed) && parsed >= BASE_INITIAL_COUNT ? parsed : BASE_INITIAL_COUNT;
    } catch {
      return BASE_INITIAL_COUNT;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncVisitorCount = async () => {
      try {
        const visitorId = getOrCreateVisitorId();
        const hasVisited =
          localStorage.getItem('itu_has_visited') === 'true' ||
          sessionStorage.getItem('itu_session_visited') === 'true';

        // Reuse existing in-flight request if one is currently pending
        if (!inFlightRequest) {
          if (!hasVisited) {
            // New visitor: record visit and increment persistent count in database
            inFlightRequest = axios
              .post(API_ENDPOINTS.RECORD_VISITOR, { visitorId })
              .then((res) => {
                try {
                  localStorage.setItem('itu_has_visited', 'true');
                  sessionStorage.setItem('itu_session_visited', 'true');
                } catch {
                  // Ignore storage quota errors
                }
                return res.data;
              })
              .finally(() => {
                inFlightRequest = null;
              });
          } else {
            // Returning visitor / page refresh: fetch current count WITHOUT incrementing
            inFlightRequest = axios
              .get(API_ENDPOINTS.GET_VISITOR_COUNT)
              .then((res) => res.data)
              .finally(() => {
                inFlightRequest = null;
              });
          }
        }

        const data = await inFlightRequest;

        if (isMounted && data && typeof data.count === 'number') {
          const validCount = Math.max(data.count, BASE_INITIAL_COUNT);
          setCount(validCount);
          try {
            localStorage.setItem('itu_cached_visitor_count', validCount.toString());
          } catch {
            // Ignore storage quota errors
          }
        }
      } catch (err) {
        // Silently handle network / cold start errors to never degrade UX
        console.debug('[VisitorCounter] Count sync note:', err.message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Run non-blocking sync after initial component mount
    syncVisitorCount();

    return () => {
      isMounted = false;
    };
  }, []);

  // Format count in Indian numbering system (e.g. 125143 -> "1,25,143")
  const formattedCharacters = (() => {
    const displayNum = typeof count === 'number' && count >= BASE_INITIAL_COUNT ? count : BASE_INITIAL_COUNT;
    return displayNum.toLocaleString('en-IN').split('');
  })();

  const currentDisplayCount = (typeof count === 'number' && count >= BASE_INITIAL_COUNT ? count : BASE_INITIAL_COUNT).toLocaleString('en-IN');

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 mb-4 text-center"
      role="status"
      aria-label={`Total website visitors: ${currentDisplayCount}`}
    >
      {/* Badge Container */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#071b30]/90 border border-blue-400/20 shadow-md backdrop-blur-sm">
        {/* Pulsing Live Activity Indicator */}
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>

        {/* Icon */}
        <Users className="w-4 h-4 text-green-400" aria-hidden="true" />

        {/* Label */}
        <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#D2E3FB]">
          Website Visitors
        </span>
      </div>

      {/* Odometer / Counter Display */}
      <div
        className={`inline-flex items-center gap-1 bg-[#051322] px-2.5 py-1 rounded-lg border border-blue-500/30 shadow-inner transition-opacity duration-300 ${
          isLoading ? 'opacity-70 animate-pulse' : 'opacity-100'
        }`}
      >
        {formattedCharacters.map((char, idx) =>
          char === ',' ? (
            <span
              key={idx}
              className="font-mono font-bold text-[#D2E3FB] text-sm sm:text-base px-0.5 select-none self-end pb-0.5"
              aria-hidden="true"
            >
              ,
            </span>
          ) : (
            <span
              key={idx}
              className="w-5 h-6 sm:w-6 sm:h-7 flex items-center justify-center font-mono font-bold text-sm sm:text-base text-white bg-gradient-to-b from-[#132c4a] via-[#0f243c] to-[#081829] rounded border border-blue-400/25 shadow-sm select-none"
            >
              {char}
            </span>
          )
        )}
      </div>
    </div>
  );
};

export default VisitorCounter;
