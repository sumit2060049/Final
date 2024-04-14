{{ config(
    tags=['mart']
) }}

-- Extracting Staging Data: Customers, Orders, and Markets
WITH 
    stg_user_training_progress AS (
        SELECT * FROM {{ ref('stg_user_training_progress') }}
    ),

-- Analyzing Customer Order Data
user_percentage_module_completed AS (
  SELECT
    module_progress_id,
    COUNT(*) AS TotalUsers,
    SUM(CASE WHEN completion_status = 'completed' THEN 1 ELSE 0 END) AS CompletedUsers,
    (SUM(CASE WHEN completion_status = 'completed' THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS CompletionPercentage
FROM
    stg_user_training_progress
GROUP BY
    module_progress_id

)

-- Final Output: Customer Order Analysis
SELECT * FROM user_percentage_module_completed


