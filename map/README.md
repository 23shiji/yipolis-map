# 简明配置手册

本文件将简单介绍map/文件夹下各个配置文件的位置及各字段含义。

所有配置文件以YAML写成，这里有一份详细教程: [YAML 语言教程](http://www.ruanyifeng.com/blog/2016/07/yaml.html)

# 关于YAML的简单说明

YAML是一种简单的标记语言，支持数字、字符串、键值对和列表。YAML为树状结构，缩进在其中非常重要，请确保你的文本编辑器不会把制表符和空格混合输入(或者干脆不要按TAB键)。

这是一个键值对

```yaml
# 这是一段注释
key1: value1 # 字段名为key1 值为"value1" 类型是字符串
key2: 12 # 字段名为key2 值为12 类型是数字
key3: '450' # 字段名为key3 值为"450" 类型是字符串
```

下面两个都是列表

```yaml
- this is a string
- 233
```

```yaml
["bi", 'li', bi, 11] # 前三个都是字符串
```

将其组合

```yaml
a:
  - b
  - c
  - d
  - e:
    f: g
    h:
      - i
    l:
      m: 1
      n: 2
j: 6
k: [123]
```

# 地图配置文件

位置: map/layers/index.yaml

```yaml
map: # 地图配置信息
  width: 6243     # 总宽度
  height: 3121    # 总高度
  center:         # 中心位置
    x: 3121
    y: 1560
  loc:    # 地理坐标配置
    lat:  # 纬度范围 以角度为单位 正为南纬 负为北纬
      from:  -90
      to:     90
    lng:  # 经度范围 以角度为单位 正为东经 负为西经
      from: -180
      to:    180
  view_zoom: 1.0 # 前往选定坐标时的缩放比例(根据前面设置的宽高)
  logo:   # 显示在左上角的LOGO 可选
    src: logo.svg
    url: http://wiki.23shiji.net/wiki/index.php/%E9%A9%BF%E5%AE%81%E5%85%B1%E5%92%8C%E5%9B%BD
layers: # 图层
  - id: default # 第一个图层, id没有实际作用
    name: 默认图层 # 名字没有实际作用
    images: # 图层包含的图片信息
    - path: map/layers/layer_default/map.min.svg
      width:  6243 # 宽度
      height: 3121 # 高度
      offset: # 相对地图左上角的偏移量，未经缩放
        x: 0
        y: 0
    zoom: # 在此缩放范围内显示
      gte: 0.0000001 # 高于此值
      lte: 100000000 # 低于此值
```

# 地标配置文件

## 地标样式

位置: map/locations/pins.yaml

地标样式定义了一个地标显示的文字标签和图标

```yaml
default: # 第一个地标样式 名为default
  icon: # 图标信息 可选
    path: map/locations/icons/default.svg
    width:  30 # 宽度
    height: 30 # 高度
    offset: # 显示时图片左上角相对于地点实际位置的偏移量
      x: -15 # 建议值: -width/2
      y: -30 # 建议值: -height
    style: '' # 应用于图标的样式 CSS
  label: # 文字标签信息 可选
    width: 80              # 文字标签宽度 单位px
    style: 'color: black;' # 文字标签样式 CSS
unknown: # 第二个地标样式 名为unknown
  label: # 文字标签信息 可选
    width: 80              # 文字标签宽度 单位px
    style: 'color: black;' # 文字标签样式 CSS
```
## 模板

位置: map/locations/templates.yaml

模板是为了降低工作量设计的，模板内容会直接插入指定了template字段的地标中

tags字段的内容会追加到地标的tags中，template字段将被忽略

如果字段的值发生冲突，将保留地标中的值

```yaml
default: # 
  pin: default # 表签名 标签信息见 map/icons/index.yaml
  tags: [标准模板]
  zoom: # 可选
    gte: 0.0000001
unknown:
  pin: unknown # 表签名 标签信息见 map/icons/index.yaml
  tags: [未登记地点]
  desc: map/locations/descriptions/unknown.md
  zoom: # 可选
    gte: 5
```

## 地标索引

位置: map/locations/index.yaml

设置所有地标的基本信息

其中desc字段指向一个Markdown格式编写的配置文件，该文件是地标的详细描述

这里有一份不错的Markdown教程: [献给写作者的 Markdown 新手指南](https://www.jianshu.com/p/q81RER)

```yaml
# 地标1
- desc: map/locations/descriptions/null_island.md # 描述文件地址
  name: Null Island # 地标名
  template: default # 模板名
  pos: # 坐标(经纬度)
    lat: 0
    lng: 0
  tags: [都市传说]
  pin: default      # 地标样式
  tags: [标准模板]   # 标签，可用于搜索
  zoom: # 在此缩放范围内显示， 可选， 当被搜索但未进入范围时只显示图标
    gte: 0.0000001
    lte: 10000
# 地标2
- desc: map/locations/descriptions/site_12.md
  name: Site-12
  template: [default] # 可以用列表选定多个模板
  pos:
    lat: 10
    lng: 10
  tags: ["SCP"]
```