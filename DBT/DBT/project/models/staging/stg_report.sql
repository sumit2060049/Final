{{
    config(
        tags=['staging']
    )
}}

WITH 

required_fields AS(

    SELECT

        ReportID AS report_id
        , UserID AS user_report_id
        , ModuleID AS module_report_id
    

    FROM {{source('sumit_etms','REPORT')}}
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


