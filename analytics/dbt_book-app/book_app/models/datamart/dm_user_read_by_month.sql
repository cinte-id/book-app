{{ config(materialized='view') }}

with user_read_by_month as (

    select FORMAT_DATETIME('%Y-%m', timestamp) AS year_month, 
        count(1) as total_users
    from {{ ref('fact_user_interactions') }} fu 
    group by FORMAT_DATETIME('%Y-%m', timestamp)
  

)
select * from user_read_by_month us 
order by us.year_month desc
