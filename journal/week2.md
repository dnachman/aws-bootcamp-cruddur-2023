# Week 2 — Distributed Tracing

## Set up honeycomb
- Installed honeycomb.io / open telemetry and honeycomb started to get data:
![Query](assets/wk2/honeycomb-query.png)
![Dataset](assets/wk2/honeycomb-dataset.png)
- Created a manual span for mock-data and get it in trace:
![Trace mock data](assets/wk2/honeycomb-trace-mock-data.png)
- Created some attributes in the span and ran query for it
![Honeycomb query](assets/wk2/hc-query.png)
![Honeycomb attributes](assets/wk2/hc-attributes.png)

## Amazon XRay
- Added instrumentation to app.py
- Set up xray group:
```
aws xray create-group --group-name "Cruddur" --filter-expression "service(\"backend-flask\")"
```
- Set up sampling rules:
```
aws xray create-sampling-rule --cli-input-json file://aws/json/xray.json
```
- Added the daemon to docker-compose.  
- Had to make sure app was initialized before xray (before I got to that part in the video ;) )
- Ran and checked traces:
![xray traces](assets/wk2/xray-traces.png)
- Service map:
![xray service map](assets/wk2/xray-servicemap.png)