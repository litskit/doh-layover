# Layover — Doha Airport

A lightweight, responsive layover planner for Hamad International Airport (DOH). It brings an arrival and departure itinerary together with Priority Pass lounge, rest, and refresh options.

## Run locally

This is a static web app with no build step or package installation.

1. Open `index.html` in a browser, or serve this directory with any static web server.
2. Use **Edit trip** to update flight details. The app stores edits in this browser's local storage.

An internet connection is needed for the hosted fonts, lounge images, and external map and flight links.

## What’s included

- Arrival and departure cards with a Doha-local countdown and layover timeline.
- Searchable Priority Pass listings with category filters for lounges, rest, and refresh.
- Google Maps walking-direction links for each listed option. Google Maps may request the device's current location; indoor coverage and routes vary.
- A link to Hamad International Airport's official terminal map.
- FlightStats links for QR740 and QR650.

## Data notes

The displayed QR740 and QR650 details are a FlightStats snapshot checked on 13 October 2026, not a live feed. FlightStats opens in a separate tab and does not sync changes back into the app; edit flight details manually after checking the source. Unknown gates remain marked TBD.

The Priority Pass listing names, hours, locations, and available ratings are stored in `app.js` and may change. Verify current access and details with Priority Pass before travel.

The Google Maps links hand off to Google Maps; the app does not provide indoor positioning or turn-by-turn airport navigation.
