# 小米空气净化器2s的HASS卡片


```
// 引入
resources:
  - type: js
    url: /community_plugin/lovelace-air-filter/air-filter.js


//使用面板卡
type: 'custom:air-filter'
entity: fan.xiaomi_miio_device


//使用面板卡（自定义背景图片）
type: 'custom:air-filter'
entity: fan.xiaomi_miio_device
style: >-
  .air-filter-panel{
    background-image:url(https://c1.mifile.cn/f/i/16/chain/air2s/mj-mtair2s-atlas-01.jpg);
    background-size:cover; 
  }

```


## 界面欣赏

#### 选择设备
![选择设备](https://raw.githubusercontent.com/shaonianzhentan/lovelace-air-filter/master/screenshots/1.png)

## 更新日志

#### 2019-7-27
  - 支持修改样式

#### 2019-7-23
  - 修复室内环境只显示“优”的情况