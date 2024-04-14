{{
    config(
        tags=['staging']
    )
}}

WITH 

required_fields AS(

    SELECT

        AssessmentID AS assess_id
        , UserID AS user_assess_id
        , ModuleID AS module_assess_id
        , Score AS score
        , DateCompleted AS date_of_assess

    FROM {{source('sumit_etms','TRAININGASSESSMENT')}}
),

datatype_conversion AS(

    SELECT
        assess_id
        , user_assess_id
        , module_assess_id
        , TRY_CAST(REPLACE(score, '$', '') AS INT) AS score
        , date_of_assess
    
    FROM required_fields
),

add_aggregate_field AS(

    SELECT
        *
        , {{var('dat')}} AS data_loaded_at

    FROM    datatype_conversion
)

SELECT * FROM add_aggregate_field


