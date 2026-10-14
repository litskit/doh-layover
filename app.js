const defaults = {
  arrivalFlight: 'QR 740',
  arrivalDate: '2026-10-14',
  arrivalFrom: 'Los Angeles (LAX)',
  arrivalStatus: 'DELAYED',
  arrivalScheduledTime: '18:30',
  arrivalDelay: '1h 24m',
  arrivalTime: '19:54',
  arrivalGate: 'TBD',
  departureFlight: 'QR 650',
  departureDate: '2026-10-15',
  departureTime: '07:00',
  departureGate: 'TBD',
  departureStatus: 'SCHEDULED',
  departureTo: 'Kathmandu (KTM)',
  departureArrivalDate: '2026-10-15',
  departureArrivalTime: '14:15',
  departureDuration: '4h 30m',
  departureTerminal: 'I'
};

const priorityOptions = [
  { id: 'al-maha-southeast', name: 'Al Maha Lounge (Southeast)', category: 'lounges', location: 'Main Terminal · Southeast', hours: '00:00–23:59', rating: '4.0', url: 'https://www.prioritypass.com/en-GB/lounges/qatar/hamad-international/doh7-al-maha-lounge-southeast', destination: 'Al Maha Lounge Southeast, Hamad International Airport' },
  { id: 'al-maha-north', name: 'Al Maha Lounge (North/Orchard)', category: 'lounges', location: 'Main Terminal · North Node / Orchard', hours: '00:00–23:59', rating: '4.1', url: 'https://www.prioritypass.com/en-GB/lounges/qatar/hamad-international/doh6-al-maha-lounge-north-node', destination: 'Al Maha Lounge North Orchard, Hamad International Airport' },
  { id: 'al-maha-south', name: 'Al Maha Lounge (South Node)', category: 'lounges', location: 'Main Terminal · South Node', hours: '00:00–23:59', rating: '4.0', url: 'https://www.prioritypass.com/en-GB/lounges/qatar/hamad-international/doh2-al-maha-lounge-south-node', destination: 'Al Maha Lounge South Node, Hamad International Airport' },
  { id: 'sleepover-c30', name: 'Sleepover (North Node, Gate C30)', category: 'rest', location: 'Main Terminal · North Node · Gate C30', hours: '00:00–23:59', rating: '4.3', url: 'https://www.prioritypass.com/en-GB/lounges/qatar/hamad-international/doh5-sleepover-north-node', destination: 'Sleepover North Node Gate C30, Hamad International Airport' },
  { id: 'sleepover-south', name: 'Sleepover (South Node)', category: 'rest', location: 'Main Terminal · South Node', hours: '00:00–23:59', rating: '4.4', url: 'https://www.prioritypass.com/en-GB/lounges/qatar/hamad-international/doh3-sleepover-south-node', destination: 'Sleepover South Node, Hamad International Airport' },
  { id: 'sleepover-c40', name: 'Sleepover Doha North Node, Gate C40', category: 'rest', location: 'Main Terminal · North Node · Gate C40', hours: '20:00–23:59', rating: '', url: 'https://www.prioritypass.com/en-GB/lounges/qatar/hamad-international/doh8r-sleepover-doha-north-node-gate-c40', destination: 'Sleepover North Node Gate C40, Hamad International Airport' },
  { id: 'be-relax-de', name: 'Be Relax Spa - (Concourse D/E)', category: 'refresh', location: 'Main Terminal · Concourse D/E', hours: '00:00–23:59', rating: '', url: 'https://www.prioritypass.com/en-GB/lounges/qatar/hamad-international/doh11s-be-relax-spa-concourse-d-e', destination: 'Be Relax Spa Concourse D E, Hamad International Airport' },
  { id: 'be-relax-c', name: 'Be Relax Spa - (Concourse C)', category: 'refresh', location: 'Main Terminal · Concourse C', hours: '00:00–23:59', rating: '', url: 'https://www.prioritypass.com/en-GB/lounges/qatar/hamad-international/doh10s-be-relax-spa', destination: 'Be Relax Spa Concourse C, Hamad International Airport' },
  { id: 'be-relax-a', name: 'Be Relax Spa - (Concourse A)', category: 'refresh', location: 'Main Terminal · Concourse A', hours: '00:00–23:59', rating: '', url: 'https://www.prioritypass.com/en-GB/lounges/qatar/hamad-international/doh9s-be-relax-spa-doh-concourse-a', destination: 'Be Relax Spa Concourse A, Hamad International Airport' }
];

const storageKey = 'layover-doha-trip-v5';
const legacyTrip = JSON.parse(localStorage.getItem('layover-doha-trip-v2') || '{}');
const previousTrip = JSON.parse(localStorage.getItem('layover-doha-trip-v3') || '{}');
const previousCurrentTrip = JSON.parse(localStorage.getItem('layover-doha-trip-v4') || '{}');
const savedTrip = JSON.parse(localStorage.getItem(storageKey) || '{}');
const trip = { ...defaults, ...legacyTrip, ...previousTrip, ...previousCurrentTrip, ...savedTrip };
if (!localStorage.getItem(storageKey)) {
  trip.departureDate = defaults.departureDate;
  trip.departureArrivalDate = defaults.departureArrivalDate;
  localStorage.setItem(storageKey, JSON.stringify(trip));
}
const dialog = document.querySelector('#edit-dialog');
const form = document.querySelector('#trip-form');
const loungeList = document.querySelector('#lounge-list');
const noResults = document.querySelector('#no-results');
let loungeCards = [];
let categoryFilter = 'all';

function formatTime(value) {
  return value;
}

function tripTimestamp(date, time) {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  return Date.UTC(year, month - 1, day, hour, minute);
}

function dateLabel(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short' })
    .format(new Date(Date.UTC(year, month - 1, day, 12)));
}

function addTripMinutes(date, time, amount) {
  const shifted = new Date(tripTimestamp(date, time) + amount * 60000);
  return {
    date: `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, '0')}-${String(shifted.getUTCDate()).padStart(2, '0')}`,
    time: `${String(shifted.getUTCHours()).padStart(2, '0')}:${String(shifted.getUTCMinutes()).padStart(2, '0')}`
  };
}

function durationText(minutes) {
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`;
}

function updateTripView() {
  for (const [key, value] of Object.entries(trip)) {
    const element = document.getElementById(key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`));
    if (element) element.textContent = key.endsWith('Time') ? formatTime(value) : value;
  }

  const signedDuration = Math.round((tripTimestamp(trip.departureDate, trip.departureTime) - tripTimestamp(trip.arrivalDate, trip.arrivalTime)) / 60000);
  const departureBeforeArrival = signedDuration < 0;
  const duration = Math.abs(signedDuration);
  document.querySelector('#duration-label').textContent = departureBeforeArrival ? `${durationText(duration)} overlap` : durationText(duration);
  document.querySelector('.connection-bridge').classList.toggle('conflict', departureBeforeArrival);
  document.querySelector('#lounge-time').textContent = durationText(departureBeforeArrival ? 0 : Math.max(0, duration - 90));
  document.querySelector('#arrival-date-label').textContent = dateLabel(trip.arrivalDate);
  document.querySelector('#departure-date-label').textContent = dateLabel(trip.departureDate);
  document.querySelector('#departure-arrival-date-label').textContent = dateLabel(trip.departureArrivalDate);
  document.querySelector('#departure-status').textContent = trip.departureStatus;
  document.querySelector('#connection-warning').hidden = !departureBeforeArrival;
  document.querySelector('.journey-timeline').hidden = departureBeforeArrival;
  if (departureBeforeArrival) {
    document.querySelector('#warning-departure').textContent = `${trip.departureTime} ${dateLabel(trip.departureDate)}`;
    document.querySelector('#warning-arrival').textContent = `${trip.arrivalTime} ${dateLabel(trip.arrivalDate)}`;
  }
  const arrivalWalk = addTripMinutes(trip.arrivalDate, trip.arrivalTime, 25);
  const headToGate = addTripMinutes(trip.departureDate, trip.departureTime, -45);
  const timeline = [
    { date: trip.arrivalDate, time: trip.arrivalTime, label: 'Arrive' },
    { ...arrivalWalk, label: 'Walk to lounge' },
    { ...headToGate, label: 'Head to gate' },
    { date: trip.departureDate, time: trip.departureTime, label: 'Depart' }
  ];
  document.querySelector('.timeline-labels').innerHTML = timeline.map((point) =>
    `<span><strong>${point.time}</strong><small class="timeline-date">${dateLabel(point.date)}</small>${point.label}</span>`
  ).join('');
  updateCountdown();
}

function updateCountdown() {
  const now = new Date();
  const nowParts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Qatar', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(now).map(({ type, value }) => [type, Number(value)]));
  const nowAtDoha = Date.UTC(nowParts.year, nowParts.month - 1, nowParts.day, nowParts.hour, nowParts.minute, nowParts.second);
  const minutesUntilDeparture = Math.ceil((tripTimestamp(trip.departureDate, trip.departureTime) - nowAtDoha) / 60000);
  document.querySelector('#countdown').textContent = minutesUntilDeparture <= 0
    ? 'Departed'
    : durationText(minutesUntilDeparture);
  document.querySelector('#local-time').textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Qatar', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date());
}

function flightStatsUrl(flightNumber) {
  const flight = flightNumber.replace(/\s+/g, '').match(/^([A-Z0-9]{2})(\d{1,4})$/i);
  const carrier = flight?.[1] || 'QR';
  const number = flight?.[2] || flightNumber;
  return `https://www.flightstats.com/v2/flight-details/${carrier}/${number}`;
}

function updateFlightStatsLinks() {
  const arrivalLink = document.querySelector('#arrival-refresh');
  const departureLink = document.querySelector('#departure-refresh');
  arrivalLink.href = flightStatsUrl(trip.arrivalFlight);
  arrivalLink.setAttribute('aria-label', `View ${trip.arrivalFlight} on FlightStats`);
  departureLink.href = flightStatsUrl(trip.departureFlight);
  departureLink.setAttribute('aria-label', `View ${trip.departureFlight} on FlightStats`);
}

function renderOptions() {
  const query = document.querySelector('#lounge-search').value.trim().toLowerCase();
  const visibleOptions = priorityOptions.filter((option) =>
    (categoryFilter === 'all' || option.category === categoryFilter)
    && `${option.name} ${option.location} ${option.category}`.toLowerCase().includes(query)
  );
  loungeCards.forEach((card) => card.remove());
  loungeCards = visibleOptions.map((option) => {
    const card = document.createElement('article');
    card.className = 'lounge-card option-card';
    card.dataset.option = option.id;
    const categoryLabel = option.category === 'lounges' ? 'LOUNGE' : option.category === 'rest' ? 'REST' : 'REFRESH';
    const rating = option.rating ? `<span class="option-rating" aria-label="Priority Pass rating ${option.rating}">★ ${option.rating}</span>` : '';
    card.innerHTML = `
      <div class="option-symbol option-${option.category}" aria-hidden="true">${categoryLabel[0]}</div>
      <div class="lounge-info">
        <div class="lounge-title-line"><h3>${option.name}</h3><span class="membership-tag">PRIORITY PASS</span></div>
        <p class="lounge-location">${option.location}</p>
        <div class="option-details"><span>${categoryLabel}</span><span>Hours ${option.hours}</span>${rating}</div>
      </div>
      <div class="lounge-meta"><a class="route-button" href="https://www.google.com/maps/dir/?api=1&amp;destination=${encodeURIComponent(option.destination)}&amp;travelmode=walking" target="_blank" rel="noopener noreferrer" aria-label="Walking directions to ${option.name} in Google Maps">Walk <span aria-hidden="true">↗</span></a><a class="option-link" href="${option.url}" target="_blank" rel="noopener noreferrer" aria-label="View ${option.name} on Priority Pass">Details ↗</a></div>`;
    loungeList.insertBefore(card, noResults);
    return card;
  });
  noResults.hidden = visibleOptions.length > 0;
  noResults.textContent = `No ${categoryFilter === 'all' ? 'options' : categoryFilter} match that search.`;
  document.querySelector('.result-count').textContent = `${visibleOptions.length} ${visibleOptions.length === 1 ? 'OPTION' : 'OPTIONS'}`;
}

function openTripEditor() {
  for (const [name, value] of Object.entries(trip)) {
    const input = form.elements.namedItem(name);
    if (input) input.value = value;
  }
  dialog.showModal();
}

document.querySelector('#arrival-refresh').addEventListener('click', () => {
  document.querySelector('#arrival-update-status').textContent = 'FlightStats opened · data is not synced';
});

document.querySelector('#departure-refresh').addEventListener('click', () => {
  document.querySelector('#departure-update-status').textContent = 'FlightStats opened · data is not synced';
});

document.querySelector('.edit-trigger').addEventListener('click', openTripEditor);
document.querySelector('#save-trip').addEventListener('click', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  for (const key of Object.keys(defaults)) trip[key] = form.elements.namedItem(key).value.trim();
  localStorage.setItem(storageKey, JSON.stringify(trip));
  updateFlightStatsLinks();
  updateTripView();
  dialog.close();
});

document.querySelector('#lounge-search').addEventListener('input', renderOptions);
document.querySelectorAll('[data-category-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    categoryFilter = button.dataset.categoryFilter;
    document.querySelectorAll('[data-category-filter]').forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-pressed', String(active));
    });
    renderOptions();
  });
});

renderOptions();
updateFlightStatsLinks();
updateTripView();
window.setInterval(updateCountdown, 30000);