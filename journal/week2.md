# Week 2 — Distributed Tracing

## Set up honeycomb

-   Installed honeycomb.io / open telemetry and honeycomb started to get data:
    ![Query](assets/wk2/honeycomb-query.png)
    ![Dataset](assets/wk2/honeycomb-dataset.png)
-   Created a manual span for mock-data and get it in trace:
    ![Trace mock data](assets/wk2/honeycomb-trace-mock-data.png)
-   Created some attributes in the span and ran query for it
    ![Honeycomb query](assets/wk2/hc-query.png)
    ![Honeycomb attributes](assets/wk2/hc-attributes.png)

## Amazon XRay

-   Added instrumentation to app.py
-   Set up xray group:

```
aws xray create-group --group-name "Cruddur" --filter-expression "service(\"backend-flask\")"
```

-   Set up sampling rules:

```
aws xray create-sampling-rule --cli-input-json file://aws/json/xray.json
```

-   Added the daemon to docker-compose.
-   Had to make sure app was initialized before xray (before I got to that part in the video ;) )
-   Ran and checked traces:
    ![xray traces](assets/wk2/xray-traces.png)
-   Service map:
    ![xray service map](assets/wk2/xray-servicemap.png)
-   Added a segment around user activities
-   Ran and got additional traces - can see the user_activities node
    ![xray traces after segment](assets/wk2/xray-traces-after-segment.png)
-   Able to see segment data and the metadata that was passed in (e.g. hello:david) :
    ![xray segment](assets/wk2/xray-segment-metadata.png)

## Amazon Cloudwatch

-   Added cloudwatch configuration and a logger to backend-flask
    -   Added to app.py `@app.after_request` to log metrics
    -   Added logs to route for `/api/activities/home`
-   Updated docker-compose with necessary environment variables
-   Ran app and checked log events:
    ![Cloudwatch logs](assets/wk2/cw-logs.png)

## Rollbar
- Added rollbar dependencies and initialization code to the backend app
- Set the `ROLLBAR_ACCESS_TOKEN: "${ROLLBAR_ACCESS_TOKEN}"` in the docker-compose.yml
- Check rollbar for logs from the application:
    ![rollbar items](assets/wk2/rollbar-items.png)
- Caused an intentional error in the application and saw it logged into Rollbar:
    ![rollbar error](assets/wk2/rollbar-error.png)
