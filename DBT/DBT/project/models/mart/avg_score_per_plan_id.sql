{{ config(
    tags=['mart']
) }}

-- Extracting Staging Data: Customers, Orders, and Markets
WITH 
    stg_assessment AS (
        SELECT * FROM {{ ref('stg_assessment') }}
    ),

    stg_module AS (
        SELECT * FROM {{ ref('stg_module') }}
    ),

    stg_plan AS (
        SELECT * FROM {{ ref('stg_plan') }}
    ),

-- Analyzing Customer Order Data
plan_avg_score AS (
  SELECT
    P.plan_id,
    P.plan_name,
    AVG(A.score) AS AvgScorePerPlan
FROM
    stg_plan P
    JOIN stg_module M ON P.plan_id = M.plan_module_id
    JOIN stg_assessment A ON M.plan_module_id = A.module_assess_id
GROUP BY
    P.plan_id, P.plan_name
)

-- Final Output: Customer Order Analysis
SELECT * FROM plan_avg_score


