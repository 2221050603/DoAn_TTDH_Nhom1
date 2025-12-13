import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:http/http.dart' as http;

class MapTest extends StatefulWidget {
  const MapTest({super.key});

  @override
  State<MapTest> createState() => _MapTestState();
}

class _MapTestState extends State<MapTest> {
  final MapController mapController = MapController();

  List<Marker> markers = [];

  @override
  void initState() {
    super.initState();
    loadStores();
  }

  Future<void> loadStores() async {
  final res =
      await http.get(Uri.parse("http://172.20.10.3:3000/api/locations"));

  print("API BODY: ${res.body}");

  if (res.statusCode == 200) {
    List<dynamic> data = json.decode(res.body);

    print("DECODED DATA: $data");  // In đúng dữ liệu JSON

    markers.clear();

    data.forEach((store) {
      print("STORE RAW LAT=${store["lat"]}, LONG=${store["long"]}");

      if (store["lat"] == null || store["long"] == null) return;
      if (store["lat"] == "0" || store["long"] == "0") return;

      double lat = double.parse(store["lat"].toString());
      double lng = double.parse(store["long"].toString());

      print("ADD MARKER: $lat, $lng");

      markers.add(
        Marker(
          point: LatLng(lat, lng),
          width: 40,
          height: 40,
          child: const Icon(Icons.location_on,
              color: Colors.red, size: 40),
        ),
      );
    });

    print("MARKER COUNT = ${markers.length}");

    setState(() {});
  }
}


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FlutterMap(
        mapController: mapController,
        options: const MapOptions(
          initialCenter: LatLng(21.0762, 105.7767),
          initialZoom: 14,
        ),
        children: [
          TileLayer(urlTemplate: "https://tile.openstreetmap.org/{z}/{x}/{y}.png"),

          MarkerLayer(markers: markers),
        ],
      ),
    );
  }
}
