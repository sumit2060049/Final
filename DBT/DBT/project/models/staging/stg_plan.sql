{{
    config(
        tags=['staging']
    )
}}

WITH 

required_fields AS(

    SELECT

        PlanID AS plan_id
        , PlanName AS plan_name
        , StartDate AS start__date
        , EndDate AS end__date
        , SubroleID AS subrole_plan_id
        , CategoryID AS category_plan_id
    

    FROM {{source('sumit_etms','TRAININGPLAN')}}
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


