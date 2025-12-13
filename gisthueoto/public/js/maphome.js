// ================= MAP INIT =================
var map = L.map('map').setView([21.0762, 105.7767], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

// ================= GLOBAL =================
let markers = [];
let userLat = null;
let userLng = null;
let userMarker = null;
let currentRoute = null;

// ================= LOAD STORES =================
fetch('/api/locations')
    .then(res => res.json())
    .then(data => {
        let lats = [], lngs = [];

        data.forEach(store => {
            const { id, name, address, lat, long } = store;
            if (!lat || !long) return;

            const latNum = +lat;
            const lngNum = +long;

            const marker = L.marker([latNum, lngNum])
                .addTo(map)
                .bindPopup(`
                    <b>${name}</b><br>
                    ${address}<br><hr>
                    <button class="btn btn-primary btn-sm"
                        onclick="findPath(${latNum}, ${lngNum})">
                        Tìm đường
                    </button>
                    <a href="/order/${id}" 
                       class="btn btn-success btn-sm ml-1"
                       style="color:white">
                       Thuê xe
                    </a>
                `);

            markers.push(marker);
            lats.push(latNum);
            lngs.push(lngNum);
        });

        if (lats.length) {
            map.flyTo([
                (Math.min(...lats) + Math.max(...lats)) / 2,
                (Math.min(...lngs) + Math.max(...lngs)) / 2
            ], 14);
        }
    });

// ================= USER LOCATION =================
function userLocation() {
    navigator.geolocation.getCurrentPosition(pos => {
        userLat = pos.coords.latitude;
        userLng = pos.coords.longitude;

        if (userMarker) map.removeLayer(userMarker);

        userMarker = L.marker([userLat, userLng], {
            icon: L.icon({
                iconUrl:
                  'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                iconSize: [25, 41]
            })
        }).addTo(map)
          .bindPopup("📍 Vị trí của bạn")
          .openPopup();

        map.flyTo([userLat, userLng], 15);
    }, () => alert("Không lấy được vị trí"));
}

// ================= ROUTING =================
function findPath(lat, lng) {
    if (!userLat) return alert("Bật định vị trước");

    if (currentRoute) map.removeControl(currentRoute);

    currentRoute = L.Routing.control({
        waypoints: [
            L.latLng(userLat, userLng),
            L.latLng(lat, lng)
        ],
        routeWhileDragging: false,
        show: false
    }).addTo(map);
}
