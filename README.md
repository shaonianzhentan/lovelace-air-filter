# 在HA里使用的小米空气净化器2s卡片


```
// 引入
resources:
  - type: js
    url: /community_plugin/lovelace-air-filter/air-filter.js

// 使用面板卡
type: 'custom:air-filter'
entity: fan.xiaomi_miio_device

```