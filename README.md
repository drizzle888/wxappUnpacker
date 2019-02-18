# MyWxAppUnpacker

![版本 0.3](https://img.shields.io/badge/版本-0.3-red.svg) ![支持的微信版本 >20180111](https://img.shields.io/badge/%E5%BE%AE%E4%BF%A1%E7%89%88%E6%9C%AC-%3E=20180111-brightgreen.svg)

> Wechat App(微信小程序, .wxapkg)解包及相关文件(.wxss, .json, .wxs, .wxml)还原工具

## 说明

- 本文是基于 [wxappUnpacker](https://github.com/qwerty472123/wxappUnpacker "wxappUnpacker") 创作的。
- 修复 “ReferenceError: $gwx is not defined” 等问题
- 支持分包
- 支持一键解包

### wxapkg 包的获取

Android 手机最近使用过的微信小程序所对应的 wxapkg 包文件都存储在特定文件夹下，可通过以下命令查看：

    adb pull /data/data/com.tencent.mm/MicroMsg/{User}/appbrand/pkg ./

其中`{User}` 为当前用户的用户名，类似于 `2bc**************b65`。

## 用法

- 安装npm和node

```bash
./install.sh -npm
```

- 安装依赖

```bash
./install.sh -dpc
```

- 解包某个小程序

```bash
./de_miniapp.sh  -d 小程序包路径(.wxapkg格式)
```

- 一键解文件夹下所有小程序

```bash
./de_miniapp.sh  小程序包所在文件夹
```

- 一键解当前文件夹下所有小程序

```bash
./de_miniapp.sh
```

## 举例

```bash
./de_miniapp.sh -d ./testpkg/_-751579163_42.wxapkg
```

![解包后的目录文件](testpkg/testdir.png)