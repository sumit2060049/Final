{{
    config(
        tags=['staging']
    )
}}

WITH 

required_fields AS(

    SELECT

        AmountID AS amount_id
        , ModuleID AS module_amount_id
        , Amount AS amount
    

    FROM {{source('sumit_etms','TRAININGAMOUNT')}}
),

datatype_conversion AS(

    SELECT
        amount_id
        , module_amount_id
        , TRY_CAST(REPLACE(amount, '$', '') AS FLOAT) AS amount
    
    FROM required_fields
),

add_aggregate_field AS(

    SELECT
        *
        , {{var('dat')}} AS data_loaded_at

    FROM    datatype_conversion
)

SELECT * FROM add_aggregate_field


