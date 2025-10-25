{{ config(materialized='table') }}

select *,
current_timestamp() as insertion_timestamp
 from {{ source('stg_users','stg_users')}}