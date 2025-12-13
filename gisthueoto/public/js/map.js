var map = L.map('map').setView([21.0762, 105.7767], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let markers = [];
let currentRoute = null;

fetch('/api/locations')
    .then(res => res.json())
    .then(data => {
        let lats = [], lngs = [];

        data.forEach(store => {
            const { id, name, address, lat, long, cars } = store;
            if (!lat || !long) return;

            const latNum = parseFloat(lat);
            const lngNum = parseFloat(long);

            // 🟦 Tạo danh sách xe để đưa vào popup
            let carList = "<ul style='padding-left:15px'>";
            if (cars && cars.length > 0) {
                cars.forEach(c => {
                    carList += `<li>${c.model} (${c.seats})</li>`;
                });
            } else {
                carList += "<li>Chưa có xe</li>";
            }
            carList += "</ul>";

            const popupHTML = `
                <div>
                    <b style="font-size:16px">${name}</b><br>
                    <span>${address}</span><br>
                    <b>Xe hiện có:</b>
                    ${carList}
                    <hr>
                    <button onclick="findPath(${latNum}, ${lngNum})" 
                        class="btn btn-primary btn-sm">
                        Tìm đường
                    </button>
                    <a href="/order/${id}" 
                        class="btn btn-success btn-sm ml-1" style="color:white;">
                        Cửa hàng
                    </a>
                </div>
            `;

            const marker = L.marker([latNum, lngNum])
                .addTo(map)
                .bindPopup(popupHTML);

            markers.push({
                marker,
                name: name.toLowerCase(),
                address: address.toLowerCase(),
                lat: latNum,
                long: lngNum
            });

            lats.push(latNum);
            lngs.push(lngNum);
        });

        if (lats.length > 0) {
            const cLat = (Math.min(...lats) + Math.max(...lats)) / 2;
            const cLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
            map.flyTo([cLat, cLng], 14);
        }
    });

// ======================== SEARCH ========================

function searchFeatures() {
    const searchText = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!searchText) return alert("Nhập thông tin tìm kiếm");
    const found = markers.filter(m =>
        m.name.includes(searchText) || m.address.includes(searchText)
    );
    if (found.length === 0) return alert("Không tìm thấy");
    map.flyTo([found[0].lat, found[0].long], 18);
    found[0].marker.openPopup();
}

// ======================== USER LOCATION ========================

let userLat, userLng;

function userLocation() {
    navigator.geolocation.getCurrentPosition(pos => {
        userLat = pos.coords.latitude;
        userLng = pos.coords.longitude;

        L.marker([userLat, userLng], {
            icon: L.icon({
                iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                iconSize: [25, 41]
            })
        }).addTo(map)
            .bindPopup("Bạn đang ở đây")
            .openPopup();

        map.flyTo([userLat, userLng], 15);
    });
}

// ======================== ROUTING ========================

function findPath(dLat, dLng) {
    if (!userLat || !userLng) return alert("Bạn cần bật định vị trước.");
    if (currentRoute) map.removeControl(currentRoute);

    currentRoute = L.Routing.control({
        waypoints: [
            L.latLng(userLat, userLng),
            L.latLng(dLat, dLng)
        ],
        routeWhileDragging: false
    }).addTo(map);
}

// ======================== NEAREST STORE ========================

document.getElementById("nearestButton").onclick = () => {
    if (!userLat) return alert("Hãy bật định vị trước!");

    let nearest = null, minDist = Infinity;

    markers.forEach(m => {
        const dist = Math.hypot(m.lat - userLat, m.long - userLng);
        if (dist < minDist) {
            minDist = dist;
            nearest = m;
        }
    });

    if (nearest) {
        findPath(nearest.lat, nearest.long);
        nearest.marker.openPopup();
    }
};
