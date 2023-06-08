---
title: Midjourney Time Series
summary: Estimate Midjourney wait times with time series data and neural networks.
# from src/images/project
thumbnail: /mj-timeseries/statsmj.jpeg
slots: [
    {
        name: "chart",
        # from src/components/project
        component: "/mj-timeseries/Chart.tsx"
    }
]
tags: [test, project]
---

# Midjourney Time Series

Average Wait Time (mm:ss) for Relaxed hours per Time of Day (hh:mm) from 00:00 to 23:45 UTC converted to your Local Time.

<slot name="chart"></slot>