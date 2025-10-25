{{ config(materialized='view') }}

with completion_rate_distr as (
    select db.genre, round(avg(fr.completion_rate),2) as avg_completion_rate_dist
    from {{ ref('fact_user_interactions') }} fu 
    join {{ ref('dim_books') }} db on db.id = fu.book_id
    join {{ ref('fact_reading_progress') }} fr on fr.book_id = db.id
    group by db.genre
)
select * from completion_rate_distr cr 
order by cr.avg_completion_rate_dist desc 