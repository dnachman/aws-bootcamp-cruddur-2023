from datetime import datetime, timedelta, timezone

from opentelemetry import trace
from aws_xray_sdk.core import xray_recorder


tracer = trace.get_tracer("user.activities")

class UserActivities:
  def run(user_handle):
    try:

      segment = xray_recorder.begin_segment("user_activities")

      model = {
        'errors': None,
        'data': None
      }

      now = datetime.now(timezone.utc).astimezone()
      
      # Xray
      segment_meta = {
        "now" : now.isoformat(),
        "hello": "david"
      }
      segment.put_metadata('key', segment_meta, 'namespace')

      if user_handle == None or len(user_handle) < 1:
        model['errors'] = ['blank_user_handle']
      else:
        now = datetime.now()
        results = [{
          'uuid': '248959df-3079-4947-b847-9e0892d1bab4',
          'handle':  'Andrew Brown',
          'message': 'Cloud is fun!',
          'created_at': (now - timedelta(days=1)).isoformat(),
          'expires_at': (now + timedelta(days=31)).isoformat()
        }]
        model['data'] = results

      #xray subsegments
      subsegment = xray_recorder.begin_subsegment('mock-data')

      dict = {
        "now": now.isoformat(),
        "results-size": len(model['data'])
      }

      subsegment.put_metadata('key', dict, 'namespace')

    finally:
      xray_recorder.end_subsegment()

    return model