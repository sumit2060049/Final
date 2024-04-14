{{
    config(
        tags=['staging']
    )
}}

WITH 

required_fields AS(

    SELECT

        UserID AS user_id
        , Username AS user_name
        , SubroleID AS subrole_id

    FROM {{source('sumit_etms','USER')}}
),

-- datatype_conversion AS(

--     SELECT
--         CAST(customer_id as INT) AS customer_id
--         , customer_name
--         , customer_segment
--         , region
--         , province
    
--     FROM required_fields
-- ),

add_aggregate_field AS(

    SELECT
        *
        , {{var('dat')}} AS data_loaded_at

    FROM    required_fields
)

SELECT * FROM add_aggregate_field


