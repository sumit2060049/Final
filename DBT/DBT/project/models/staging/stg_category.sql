{{
    config(
        tags=['staging']
    )
}}

WITH 

required_fields AS(

    SELECT

        CategoryID AS category_id
        , CategoryName AS category_name
    

    FROM {{source('sumit_etms','TRAININGCATEGORY')}}
),

-- datatype_conversion AS(

--     SELECT
--         amount_id
--         , module_amount_id
--         , TRY_CAST(REPLACE(amount, '$', '') AS FLOAT) AS amount
    
--     FROM required_fields
-- ),

add_aggregate_field AS(

    SELECT
        *
        , {{var('dat')}} AS data_loaded_at

    FROM    required_fields
)

SELECT * FROM add_aggregate_field


