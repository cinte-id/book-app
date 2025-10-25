{{ config(materialized='view') }}

with user_segments as (
  select t.user_id, u.name, t.books_count, year, u.age, u.province,
    case 
      when books_count>=10 then 'Gold'
      when books_count >= 5 and t.books_count < 10 then 'Silver'
      else 'Bronze'
      end as user_segment
  from (
    select fu.user_id, count(1) as books_count, EXTRACT(YEAR FROM timestamp) AS year
    from {{ ref ('fact_user_interactions') }} fu 
    group by fu.user_id, EXTRACT(YEAR FROM timestamp)
    ) as t
  join {{ ref('dim_users') }} u on u.id = t.user_id

)
select * from user_segments us 
order by us.year desc, us.books_count desc