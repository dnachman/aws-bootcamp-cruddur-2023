SELECT users.uuid,
  users.handle,
  users.display_name
from public.users
where users.handle = %(handle)s