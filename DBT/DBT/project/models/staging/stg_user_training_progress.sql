{{
    config(
        tags=['staging']
    )
}}

WITH 

required_fields AS(

    SELECT

        ProgressID AS progress_id
        , UserID AS user_progress_id
        , ModuleID AS module_progress_id
        , CompletionStatus AS completion_status
        , DateCompleted AS completion_date
    

    FROM {{source('sumit_etms','USERTRAININGPROGRESS')}}
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


