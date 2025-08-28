---
layout: single
title: "postgresql dump and restore"
categories: database
tags: database postgresql dump restore
collection: 2025
classes: wide

toc: true
toc_label: "Content Outline"
toc_icon: "cog"
toc_sticky: true

---

## pg dump

```shell
psql -d sewsmart -U sewsmart  -c "\copy (select * from daily_production_source where date(gen_time) >= '2025-08-01' and date(gen_time) < '2025-08-05') TO 'daily_production_source_2025_08.csv' WITH CSV HEADER"
```

## pg restore

```shell
psql -d sewsmart -U sewsmart  -c "\COPY daily_production_source FROM 'daily_production_source_2025_08.csv' WITH (FORMAT CSV, HEADER)"
```