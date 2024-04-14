{{ config(
    tags=['mart']
) }}

-- Extracting Staging Data: Customers, Orders, and Markets
WITH 
    stg_amount AS (
        SELECT * FROM {{ ref('stg_amount') }}
    ),

    stg_module AS (
        SELECT * FROM {{ ref('stg_module') }}
    ),

    stg_plan AS (
        SELECT * FROM {{ ref('stg_plan') }}
    ),

-- Analyzing Customer Order Data
per_planid_spend AS (
  SELECT
    TP.plan_id,
    TP.plan_name,
    SUM(TA.amount) AS AmountSpent
FROM
    stg_amount TA
    JOIN stg_module TM ON TA.module_amount_id = TM.module_id
    JOIN stg_plan TP ON TM.plan_module_id = TP.plan_id
GROUP BY
    TP.plan_id,
    TP.plan_name


)

-- Final Output: Customer Order Analysis
SELECT * FROM per_planid_spend


