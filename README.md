# ðŸ’œ LOVE CARE GLOBAL HOME NURSING
### ðŸŒ Main Site: https://lovecareglobal.com/
**Your health, our heart.**

> We bring licensed nurses right to your doorstep â€” compassionate, professional care in 8 countries, 24/7. Now with live tracking, secure Paystack, and 2-step verified nurses.

[[Live](https://img.shields.io/badge/LIVE-lovecareglobal.com-brightgreen)](https://lovecareglobal.com)
[[Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB-orange)](https://firebase.google.com)
[[Paystack](https://img.shields.io/badge/Paystack-GHS%20%2F%20USD-blue)](https://paystack.com)
[[License](https://img.shields.io/badge/License-Proprietary-red)](#)

---

## ðŸ“‹ Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Main Pages](#main-pages)
- [Tech Stack](#tech-stack)
- [Booking Flow](#booking-flow)
- [Currency System](#currency-system)
- [Real-Time Notifications](#real-time-notifications)
- [Firebase Structure](#firebase-structure)
- [Installation](#installation)
- [Recent Fixes](#recent-fixes)

---

## ðŸ¥ Overview
**Love Care Global** is a home nursing platform connecting clients with verified nurses across Ghana and international locations (USA). Clients can view nurse profiles with photo/video/rating, select nearby nurses via blinking map, and pay via Paystack (Full or 50% + Cash).

**Key Stats:**
- ðŸ“ Live tracking + GPS verified nurses
- âš¡ Secure Paystack + Pay on Delivery (50% option)
- ðŸ’œ 2-Step verified nurses (Photo, ID, Licence, Video checked by CEO)
- â­ Client ratings â€” High rank, live from bookings
- ðŸŒ 8 countries, 24/7 availability

---

## âœ¨ Features

### ðŸ‘©â€âš•ï¸ For Clients
- **Select Nurse:** Blinking map (Leaflet.js) + nearby search (5km-50km) + My Location
- **Preview Nurse:** Tap card â†’ Video from registration (auto-play) + Photo + Rating + Bio + Services
- **International Time:** Shows both 12h AM/PM and 24h format â€” Ghana (AM/PM) + Outside Ghana (24h)
- **Currency Live:** Ghana â†’ GHS, USA â†’ USD â€” CEO sets rates live from Dashboard Page 4
- **Calculation Breakdown:** How calculation was made â€” Startâ†’End â†’ Hours/Day (Auto: End-Start) â†’ QtyÃ—Mode â†’ Total Hours â†’ CEO Rate â†’ Base â†’ Transport â†’ Total
- **Paystack:** Full payment or 50% Now + 50% Cash to nurse
- **My Bookings:** Client sees progress â€” Pending â†’ Accepted (nurse coming) â†’ Rejected
- **Live Tracking:** When nurse accepts, auto Google Maps navigation opens â€” Monitor nurse coming with blinking dot
- **Alerts:** Real-time notifications when nurse accepts/rejects â€” Vibration + Sound + Browser notification

### ðŸ‘©â€âš•ï¸ For Nurses
- **My Job Offers:** `my-job-offer.html` â€” Real working Accept/Reject buttons (not picture)
  - Green âœ… Accept â€” Updates all Firebase paths â€” CEO Dashboard shows accepted
  - Red âŒ Reject â€” Frees nurse for other bookings â€” Client can book another
  - Shows client name, phone, patient, hours, amount, paystack ref, Google Maps link
  - 80/20 split: Nurse 80% / CEO 20%
  - Real-time auto-refresh (20s) + Firebase `onValue` listener
- **Dashboard:** `nurses-dashboard.html` â€” Nurse dashboard

### ðŸ‘‘ For CEO
- **CEO Dashboard:** `Ceo-Dashboard_9.html` â€” 4 pages
  - Page 1: Pending registrations, Group Chat Master Controls (Master Delete, Block/Unblock Manager)
  - Page 2: Approved nurses
  - Page 3: Client bookings â€” Delete & Export CSV â€” View full details â€” Call client â€” Google Maps
  - Page 4: Rates â€” Set GHS and USD hourly rates live â€” Affects book-nurse price calculation in real-time
- **Group Chat:** `nurse-group-chat.html` â€” CEO controls: Master Delete (Wipe all), Block/Unblock â€” Edit/Delete remain, Block removed from messages

---

## ðŸ“„ Main Pages

| File | Purpose | Key Features |
|------|---------|--------------|
| `index.html` | Landing | Welcome, Join as Nurse, Book Nurse, Live Tracking, Ratings |
| `book-nurse.html` / `BOOK-NURSE-ALL-BUTTONS-WORKING-FINAL.html` / `book-nurse-full.html` | Full Payment | Blinking map, Video preview, Hours Auto, Currency Live (GHS/USD), Paystack Full |
| `book-nurse-50-percent.html` | 50% Payment | Pay 50% via Paystack + 50% Cash to nurse â€” Currency live â€” Breakdown |
| `my-bookings.html` / `my-bookings_2.html` | Client Progress | Real-time status, Live tracking map, Auto Google Maps when accepted, Notification |
| `my-job-offer.html` / `my-job-offer-final.html` | Nurse Jobs | Real working Accept/Reject buttons (fixed from picture), Auth, 6-path update |
| `alerts.html` | Alerts | Fixes 404 â€” Real-time accept/reject alerts, Vibration, Sound, Mark read/clear |
| `Ceo-Dashboard_9.html` | CEO Dashboard | 4 pages, Master controls, Bookings, Rates (GHS/USD live) |
| `nurse-group-chat_3.html` | Group Chat | Edit/Del remain, Block removed, Master Delete, Block Manager |
| `sos.html` | SOS | Emergency SOS |

---

## ðŸ› ï¸ Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla), Inter font, Plus Jakarta Sans
- **Maps:** Leaflet.js 1.9.4 + OpenStreetMap â€” Blinking nurse markers with pulse animation
- **Payments:** Paystack Inline JS â€” `pk_live_f17ae09bf855010825cbfccdda8e724553ab747b` â€” Currency GHS/USD
- **Backend:** Firebase Realtime Database + Auth (Anonymous) + Firestore
- **Config:**
  ```js
  const firebaseConfig={
    apiKey:"AIzaSyB52-X1D8Cg-wUDWPds_tR7X3cF82dMdRg",
    authDomain:"web-care-618e8.firebaseapp.com",
    databaseURL:"https://web-care-618e8-default-rtdb.firebaseio.com",
    projectId:"web-care-618e8"
  }
  ```

---

## ðŸ”„ Booking Flow

```mermaid
Client â†’ book-nurse.html (Full or 50%)
  â†’ Select nurse on blinking map
  â†’ Preview video from registration
  â†’ Set Start/End time (Hours auto: End-Start)
  â†’ Care Mode: Daily/Weekly(x7)/Monthly(x30)
  â†’ Country: Ghana GHS / USA USD (CEO rate live)
  â†’ Transport + Client/Phone/Patient
  â†’ Calculation breakdown shown
  â†’ Tap Paystack button â†’ Paystack popup opens
  â†’ Pay GHS/USD â€” Ref generated

  â†’ Saves to 7 places:
    1. bookings/{LCG-ID}
    2. nurseBookings/{nurseId}/{LCG-ID}
    3. jobOffers/{LCG-ID}
    4. myJobOffers/{nurseId}/{LCG-ID}
    5. ceoBookings/{LCG-ID}
    6. allBookings/{LCG-ID}
    7. config/stats/lastBooking

Nurse â†’ my-job-offer.html
  â†’ Sees LCG-20251016-ABC123 PENDING + GHS 244
  â†’ Taps âœ… Accept (real working button, not picture)
  â†’ Firebase auth â†’ Updates status=accepted in all 6 paths

Client â†’ my-bookings.html (Real-time onValue)
  â†’ Detects status pendingâ†’accepted
  â†’ Shows notification: âœ… Nurse Accepted! + Vibration
  â†’ Live tracking map appears: Client blue dot + Nurse green blinking dot + Dashed line
  â†’ Auto prompt: Open Google Maps to track nurse?
  â†’ Click â†’ https://www.google.com/maps/dir/?api=1&origin=nurseLat,nurseLng&destination=clientLat,clientLng

Client â†’ alerts.html
  â†’ Real-time alert: âœ… ACCEPTED â€” Nurse accepted! Nurse is coming â€” Track live
  â†’ Vibration + Sound + Browser notification
  â†’ Buttons: Track Nurse Live, Google Maps

If Rejected:
  Client gets âŒ Rejected alert â†’ Book another nurse â†’ Refund per policy
  Nurse freed for other bookings
```

---

## ðŸ’± Currency System (Fixed)

**Bug Fixed:** When USA selected, calculation still showed GHS.

**Now:**
- `getSelectedCurrency()` reads `countrySelect` value
- Ghana â†’ `{code:'GHS', rate:ceoHourlyRateGHS}` (e.g., 17/hr)
- USA â†’ `{code:'USD', rate:ceoHourlyRateUSD}` (e.g., 8/hr)
- Calculation: `(Hours/Day Ã— Qty Ã— Mode) Ã— HourlyRate + Transport = Total`
- All displays use `currCode`: `GHS 17.00/hr` or `USD 8.00/hr`
- Paystack: `currency: currCode` â€” GHS or USD
- Booking saved with `currency: currCode`
- CEO Dashboard Page 4 sets both rates live: `config/rates {GHS:{hourly:17}, USD:{hourly:8}}`

---

## ðŸ”” Real-Time Notifications

- **my-job-offer.html:** `rtdb.ref('nurseBookings/'+nurseId).on('value')` â€” Auto-refresh 20s
- **my-bookings.html:** `onValue(ref(db,'bookings'))` â€” Listens for phone match â€” When status changes pendingâ†’accepted, shows notification + auto Google Maps
- **alerts.html:** `onValue(ref(db,'bookings'))` â€” When nurse accepts/rejects, alert added to list + Vibration + Sound + Browser Notification API
- **Previous statuses tracking:** `previousStatuses[bookingId]` to detect change

---

## ðŸ—‚ï¸ Firebase Structure

```
nurses/
  {nurseId}/
    fullName, photoURL, videoURL, rating, lat, lng, phone, bio, isApproved

nurseBookings/
  {nurseId}/
    {bookingId}/
      id, bookingId, clientName, phone, patientName, nurseId, nurseName,
      amount, amountPaidNow, amountCOD, currency (GHS/USD),
      paymentMethod (paystack_full / paystack_50_50), paystackRef,
      status (pending/accepted/rejected), time, totalHours, hrsPerDay,
      startTime, endTime, careMode, quantity, transport,
      hourlyRateUsed, ceoRates, clientLat, clientLng, service,
      amountSplit {nurse, ceo}, calcBreakdown, acceptedAt, rejectedAt

bookings/{bookingId} â€” Same as above (global)
jobOffers/{bookingId} â€” Same (pool)
myJobOffers/{nurseId}/{bookingId} â€” Same (nurse personal)
ceoBookings/{bookingId} â€” Same (CEO view)
allBookings/{bookingId} â€” Same (all)

clientBookings/{clientId}/{bookingId} â€” Client personal (if used)
nurseLocations/{nurseId}/{lat,lng} â€” Live nurse location (optional)

config/
  rates/
    GHS: {hourly:17}
    USD: {hourly:8}
    lastUpdated, lastUpdatedBy
  stats/
    lastBooking: {id, time, amount}

alerts (localStorage: lcg_alerts)
  [{id, bookingId, type (accepted/rejected/pending/tracking), title, message, nurseName, amount, currency, clientLat, clientLng, time, read}]
```

---

## ðŸš€ Installation

1. **Clone repo:**
   ```bash
   git clone https://github.com/yourusername/lovecareglobal.com.git
   cd lovecareglobal.com
   ```

2. **Firebase Setup:**
   - Project already configured: `web-care-618e8`
   - Enable Realtime Database + Anonymous Auth
   - Rules (example):
     ```json
     {
       "rules": {
         ".read": true,
         ".write": true
       }
     }
     ```

3. **Paystack:**
   - Live key: `pk_live_f17ae09bf855010825cbfccdda8e724553ab747b`
   - Supports GHS and USD

4. **Run locally:**
   - Open `index.html` in browser
   - Or `python -m http.server 8000` â†’ http://localhost:8000

5. **Deploy:**
   - Upload to `lovecareglobal.com` hosting
   - Ensure all HTML files in root
   - Check `alerts.html` exists (fixes 404)

---

## ðŸ› Recent Fixes (Oct 2026)

### âœ… Fixed: Currency USD/GHS Switch
- **Issue:** Selecting USA â€” USD still showed GHS 17/hr and GHS 253 total
- **Fix:** `getSelectedCurrency()` + `calcTotal()` now uses `currCode` + `curRate` â€” Displays USD 8/hr and USD 172 when USA selected â€” Paystack currency also USD

### âœ… Fixed: Accept/Reject Buttons Like Picture
- **Issue:** my-job-offer.html buttons looked like picture, not clickable (Screenshot 12:30 AM)
- **Fix:** Added `type="button"`, `pointer-events:auto`, `touch-action:manipulation`, `min-height:48px`, `z-index:10`, `onclick` + `ontouchend` + `addEventListener` â€” Real working buttons â€” Added Firebase anonymous auth before update â€” Updates 6 paths

### âœ… Fixed: Client Progress + Notification
- **Issue:** Client page my-bookings_2.html showed No booking, no notification when nurse accepts
- **Fix:** Upgraded to real-time `onValue(bookings)` filtered by phone â€” When nurse accepts, shows notification banner + Vibration + Sound + Auto live tracking map + Auto Google Maps prompt â€” Blinking nurse marker moving toward client

### âœ… Fixed: Alerts 404
- **Issue:** Bottom tab ðŸ”” Alerts â†’ 404 Not Found (Screenshot 1:09 AM)
- **Fix:** Created `alerts.html` â€” Real-time alerts list â€” Accepted/Rejected/Pending/Tracking â€” Vibration + Sound + Browser Notification â€” Mark read/clear â€” Fixes 404

### âœ… Fixed: Undefined Display
- **Issue:** my-bookings showed `Client: undefined, undefined | Nurse: undefined is on the way`
- **Fix:** Added fallbacks: `b.clientLat||5.6037`, `b.nurseName||'Nurse'`, `.toFixed(4)` â€” Never shows undefined

### âœ… Fixed: Group Chat Block
- **Issue:** Group chat had block button in messages (should only be in CEO Dashboard)
- **Fix:** `nurse-group-chat_3.html` â€” Edit/Delete remain, Block removed from messages â€” Block/Unblock only in CEO Dashboard Page 1

---

## ðŸ“ž Contact
- **Phone:** +233544121814
- **Email:** lovecareglobal@gmail.com
- **Site:** https://lovecareglobal.com/
- **SOS:** `sos.html`

---

## ðŸ“„ License
Proprietary â€” Love Care Global Home Nursing â€” All rights reserved.

---

### ðŸ™ Credits
- **CEO:** lovecareglobal@gmail.com
- **Nurses:** Verified 2-step â€” Photo, ID, Licence, Video
- **Clients:** ASABERE PETER (+233544121814) â€” Demo client
- **Tech:** Firebase, Leaflet, Paystack, Inter font

**Your health, our heart. ðŸ’œ**
