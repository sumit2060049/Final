{{ config(
    tags=['mart']
) }}

-- Extracting Staging Data: Customers, Orders, and Markets
WITH 
    stg_user AS (
        SELECT * FROM {{ ref('stg_user') }}
    ),

    stg_assessment AS (
        SELECT * FROM {{ ref('stg_assessment') }}
    ),

    stg_module AS (
        SELECT * FROM {{ ref('stg_module') }}
    ),

-- Analyzing Customer Order Data
module_best_performer AS (
  SELECT
    TA.user_assess_id,
    U.user_name,
    TA.score,
    TM.module_id,
    TM.module_name
FROM
    stg_assessment TA
    JOIN stg_user U ON TA.user_assess_id = U.user_id
    JOIN stg_module TM ON TA.module_assess_id = TM.module_id
    JOIN (
        SELECT
            module_assess_id,
            MAX(score) AS MaxScore
        FROM
            stg_assessment
        GROUP BY
            module_assess_id
    ) AS MaxScores ON TA.module_assess_id = MaxScores.module_assess_id AND TA.score = MaxScores.MaxScore

)

-- Final Output: Customer Order Analysis
SELECT * FROM module_best_performer


