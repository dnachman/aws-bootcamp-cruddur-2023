from datetime import datetime, timedelta, timezone
from opentelemetry import trace
from lib.db import pool

tracer = trace.get_tracer("home.activities")

class HomeActivities:
  # def run(logger):
  def run(cognito_user_id = None):
    # logger.info("HomeActivities")
    with tracer.start_as_current_span("home-activities-mock-data"):
      span = trace.get_current_span()
      
      now = datetime.now(timezone.utc).astimezone()
      
      # pass value to span
      span.set_attribute("app.now", now.isoformat())

      sql = """
        select * from public.actvities
      """

      with pool.connection() as conn:
        with conn.cursor() as cur:
          cur.execute(sql)
          json = cur.fetchone()
      return json[0]

      span.set_attribute("app.result_length", len(results))
      return results