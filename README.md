# lovelace-air-filter
小米空气净化器2s的卡片



resources:
  - url: /local/air-filter.js
    type: js
views:
- name: Example
  cards:
  - type: "custom:air-filter"
    entity: input_boolean.switch_tv