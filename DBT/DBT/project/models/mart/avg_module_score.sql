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

-- Analyzing Customer Order Data
module_avg_score AS (
  SELECT
    TM.module_id,
    TM.module_name,
    AVG(TA.score) AS AvgScore
FROM
    stg_assessment TA
    JOIN stg_module TM ON TA.module_assess_id = TM.module_id
GROUP BY
    TM.module_id,
    TM.module_name
ORDER BY
    AvgScore DESC

)

-- Final Output: Customer Order Analysis
SELECT * FROM module_avg_score


