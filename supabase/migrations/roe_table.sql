create table user_roles (
  user_id uuid references auth.users(id) on delete cascade,
  role text check (role in ('admin', 'staff')) not null,
  primary key (user_id)
);

alter table students enable row level security;
alter table user_roles enable row level security;

create policy "allow full access for admin"
on students
for all
using (
  exists (
    select 1 from user_roles
    where user_roles.user_id = auth.uid()
    and user_roles.role = 'admin'
  )
);
