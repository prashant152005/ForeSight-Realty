# Write your MySQL query statement below
with n1 as (
    select c.com_id as com_id, sales_id
    from company c
    join orders o
    on c.com_id = o.com_id
    where name like 'RED%'
)
select distinct sp.name
from salesperson sp
left join orders o
on sp.sales_id = o.sales_id
where o.com_id not in (select com_id from n1)
and o.sales_id not in (select sales_id from n1)
or o.sales_id is null
