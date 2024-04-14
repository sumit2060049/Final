{{
    config(
        tags=['staging']
    )
}}

WITH 

required_fields AS(

    SELECT

        ModuleID AS module_id
        , ModuleName AS module_name
        , PlanID AS plan_module_id
        , ModuleDate AS module_date

    FROM {{source('sumit_etms','TRAININGMODULE')}}
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


