#from opentelemetry import trace
from lib.db import db

#tracer = trace.get_tracer("home.activities")

class HomeActivities:
  # def run(logger):
  def run(cognito_user_id = None):
    # logger.info("HomeActivities")

    # with tracer.start_as_current_span("home-activities-mock-data"):
    #   span = trace.get_current_span()
    # pass value to span
    # span.set_attribute("app.now", now.isoformat())
    # span.set_attribute("app.result_length", len(json[0]))

    sql = db.template('activities', 'home')
    results = db.query_array_json(sql)
    return results 
