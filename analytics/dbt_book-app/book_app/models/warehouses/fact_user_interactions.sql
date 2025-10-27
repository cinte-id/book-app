{{ config(materialized='table') }}

select *,
current_timestamp() as insertion_timestamp
 from {{ source('stg_user_interactions','stg_user_interactions')}}