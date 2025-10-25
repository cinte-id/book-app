{{ config(materialized='view') }}

with top_book as (

    select dm.*, t.books_count from 
    (
    select fu.book_id, count(1) as books_count
    from {{ref ('fact_user_interactions') }} fu 
    group by fu.book_id) t 
    join {{ref ('dim_books') }} dm on dm.id = t.book_id
    limit 5

)
select * from top_book tp
order by tp.books_count desc 