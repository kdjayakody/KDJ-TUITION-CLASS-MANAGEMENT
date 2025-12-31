-- Create a dummy user in auth.users manually to test deletion logic (simulation)
-- Actually we can't easily insert into auth.users via SQL editor usually due to hashing passwords etc.
-- But we can try to call the RPC function with a known-bad ID to see if it's the logic or the permissions.

-- Let's try to redefine the function to be simpler and catch errors.
create or replace function public.delete_user_completely(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth -- Include auth schema
as $$
declare
  requester_role text;
begin
  -- Get requester role
  select role into requester_role from public.profiles where id = auth.uid();
  
  if requester_role not in ('admin', 'staff') then
    raise exception 'Access Denied: User role % is not authorized.', requester_role;
  end if;

  -- Delete from profiles first (to be safe/explicit, though Cascade handles it)
  -- delete from public.profiles where id = target_user_id; 
  -- Actually, deleting from auth.users should cascade to profiles if FKey is set up right.
  -- But we defined profiles.id references auth.users.id on delete cascade? 
  -- Let's check the FK.
  
  delete from auth.users where id = target_user_id;
end;
$$;
