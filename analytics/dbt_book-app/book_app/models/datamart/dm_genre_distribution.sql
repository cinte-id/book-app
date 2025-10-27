{{ config(materialized='view') }}

with genre_distr as (
    select db.genre, count(1) as genre_count
    from {{ ref('fact_user_interactions') }} fu 
    join {{ ref('dim_books') }} db on db.id = fu.book_id
    group by db.genre
)
select * from genre_distr