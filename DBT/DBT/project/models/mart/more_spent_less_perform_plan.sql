{{ config(
    tags=['mart']
) }}

-- Extracting Staging Data: Customers, Orders, and Markets
WITH 
    stg_plan AS (
        SELECT * FROM {{ ref('stg_plan') }}
    ),

    stg_module AS (
        SELECT * FROM {{ ref('stg_module') }}
    ),

    stg_assessment AS (
        SELECT * FROM {{ ref('stg_assessment') }}
    ),

    stg_amount AS (
        SELECT * FROM {{ ref('stg_amount') }}
    ),

-- Analyzing Customer Order Data
more_spent_less_performance AS (
  WITH ModuleSpending AS (
    SELECT
        module_amount_id as ModuleID,
        SUM(Amount) AS TotalAmount
    FROM
        stg_amount
    GROUP BY
        ModuleID
),
PlanSpending AS (
    SELECT
        M.module_id,
        M.plan_module_id,
        MS.TotalAmount
    FROM
        stg_module M
        JOIN ModuleSpending MS ON M.module_id = MS.ModuleID
),
PlanPerformance AS (
    SELECT
        P.plan_id AS PlanID,
        AVG(A.Score) AS AverageScore
    FROM
        stg_plan P
        JOIN stg_module M ON P.plan_id = M.plan_module_id
        JOIN stg_assessment A ON M.module_id = A.module_assess_id
    GROUP BY
        P.plan_id
)
SELECT
    P.plan_id,
    P.plan_name,
    PS.TotalAmount,
    PP.AverageScore
FROM
    stg_plan P
    JOIN PlanSpending PS ON P.plan_id = PS.plan_module_id
    JOIN PlanPerformance PP ON P.plan_id = PP.PlanID
WHERE
    PS.TotalAmount > 0
    AND PS.TotalAmount > 10000 -- Example threshold for "more money spent"
    AND PP.AverageScore < 90 -- Example threshold for "average performance is less"
ORDER BY
    PS.TotalAmount DESC


)

-- Final Output: Customer Order Analysis
SELECT * FROM more_spent_less_performance


