// ================== INIT MAP ==================
var map = L.map('map').setView([21.0762, 105.7767], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// ================== GLOBAL ==================
let markers = [];
let currentRoute = null;
let userLat = null;
let userLng = null;
let userMarker = null;

// ================== LOAD LOCATIONS ==================
fetch('/api/locations')
    .then(res => res.json())
    .then(data => {
        let lats = [], lngs = [];

        data.forEach(store => {
            const { id, name, address, lat, long, phone_number } = store;
            if (!lat || !long) return;

            const latNum = parseFloat(lat);
            const lngNum = parseFloat(long);

            const popupHTML = `
                <div>
                    <b style="font-size:15px">${name}</b><br>
                    <span>${address}</span><br>
                    ${phone_number ? `<span>SĐT: ${phone_number}</span><br>` : ``}
                    <hr style="margin:6px 0">
                    <button class="btn btn-primary btn-sm"
                        onclick="findPath(${latNum}, ${lngNum})">
                        Tìm đường
                    </button>
                    <a href="/order/${id}"
                        class="btn btn-success btn-sm ml-1"
                        style="color:white">
                        Cửa hàng
                    </a>
                </div>
            `;

            const marker = L.marker([latNum, lngNum])
                .addTo(map)
                .bindPopup(popupHTML);

            markers.push(marker);

            lats.push(latNum);
            lngs.push(lngNum);
        });

        if (lats.length > 0) {
            const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
            const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
            map.flyTo([centerLat, centerLng], 14);
        }
    })
    .catch(err => console.error("Lỗi load locations:", err));

// ================== USER LOCATION ==================
function userLocation() {
    if (!navigator.geolocation) {
        return alert("Trình duyệt không hỗ trợ định vị");
    }

    navigator.geolocation.getCurrentPosition(
        pos => {
            userLat = pos.coords.latitude;
            userLng = pos.coords.longitude;

            if (userMarker) {
                map.removeLayer(userMarker);
            }

            userMarker = L.marker([userLat, userLng], {
                icon: L.icon({
                    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41]
                })
            })
                .addTo(map)
                .bindPopup("📍 Vị trí của bạn")
                .openPopup();

            map.flyTo([userLat, userLng], 15);
        },
        () => alert("Không lấy được vị trí")
    );
}

// ================== ROUTING ==================
function findPath(destLat, destLng) {
    if (!userLat || !userLng) {
        return alert("Hãy bấm 'Vị trí của bạn' trước");
    }

    if (currentRoute) {
        map.removeControl(currentRoute);
    }

    currentRoute = L.Routing.control({
        waypoints: [
            L.latLng(userLat, userLng),
            L.latLng(destLat, destLng)
        ],
        routeWhileDragging: false,
        show: false
    }).addTo(map);
}
userLocation();
