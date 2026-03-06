isaac swiftdelivery (client-side)

Simple single-file client-side app to create tracking codes, update status, and view tracking history. Data is stored in browser `localStorage` under key `delivery_tracks_v1`.

Usage

- Open `index.html` in a browser (double-click) or serve the folder with a local server.

Optional local server (Python):

```bash
# from inside the folder containing index.html
python -m http.server 8000
# then open http://localhost:8000
```

Notes

- This is a demo client-side solution. For multi-user usage or persistence across devices, run a backend server and replace localStorage with API calls.
- To create demo data in the browser console run: `_deliveryDemo()`
