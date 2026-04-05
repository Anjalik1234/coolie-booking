import { create } from 'zustand';
import Cookies from 'js-cookie';

/**
 * Zustand global store — purely memory and Cookie-driven.
 * Handles auth, bookings, and UI state without using localStorage.
 */
const useStore = create((set, get) => {
  // Attempt to load user from cookie if it exists
  let initialUser = null;
  try {
    const userCookie = Cookies.get('user');
    if (userCookie) initialUser = JSON.parse(userCookie);
  } catch (e) {
    console.error('Failed to parse user cookie', e);
  }

  return {
    // ── Auth ────────────────────────────────────
    user: initialUser,
    token: Cookies.get('token') || null,
    isAuthenticated: !!Cookies.get('token'),

    setUser: (user, tokenParam) => {
      const activeToken = tokenParam || Cookies.get('token');
      // Store user safely in a cookie so it survives page reloads
      Cookies.set('user', JSON.stringify(user), { path: '/', sameSite: 'lax' });
      set({ user, token: activeToken, isAuthenticated: true });
    },

    logout: () => {
      Cookies.remove('token', { path: '/' });
      Cookies.remove('user', { path: '/' });
      set({ user: null, token: null, isAuthenticated: false });
    },

    // ── Bookings ────────────────────────────────
    bookings: [],
    activeBooking: null,

    setBookings: (bookings) => set({ bookings }),

    addBooking: (booking) =>
      set((state) => ({ bookings: [booking, ...state.bookings] })),

    setActiveBooking: (booking) => set({ activeBooking: booking }),

    cancelBooking: (bookingId) =>
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'cancelled' } : b
        ),
      })),

    // ── UI ─────────────────────────────────────
    isLoading: false,
    setLoading: (val) => set({ isLoading: val }),

    selectedStation: '',
    setSelectedStation: (s) => set({ selectedStation: s }),
  };
});

export default useStore;