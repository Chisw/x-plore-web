# x-plore-web
Web UI for X-plore.apk

### 安装依赖

- 安装 JDK https://www.oracle.com/java/technologies/javase-downloads.html
- 安装 Apktool https://ibotpeaches.github.io/Apktool/install/
- 安装 android-sdk `brew install android-sdk`
- 安装 Nginx `brew install nginx`

```sh
brew tap adoptopenjdk/openjdk
brew install --cask adoptopenjdk8
sdkmanager "build-tools;30.0.0"
```

### 反编译

```sh
cd /usr/local/bin
sudo java -jar apktool.jar d target.apk
```

### 搞事情

。。

### 回编译

```sh
cd /usr/local/bin
java -jar apktool.jar b [target-folder]
```

### 生成签名

```sh
keytool -genkey -v -keystore [jswjks.jks] -keyalg RSA -keysize 2048 -validity 10000 -alias [jswjks]
```

### 签名 V1

```sh
jarsigner -verbose -keystore [jswjks.jks] -signedjar [signed-v1.apk] [compile.apk] [jswjks]
```

### 签名 V2

```sh
cd /Users/Chisw/Library/Android/sdk/build-tools/30.0.0
./zipalign -v 4 [signed-v1.apk] [signed-v1-aligned.apk]
# ./zipalign -c -v 4 [signed-v1-aligned.apk]
./apksigner sign --ks [jswjks.jks] --ks-key-alias [jswjks] --out [signed-v2.apk] [signed-v1-aligned.apk]
# ./apksigner verify -v [signed-v2.apk]
```

### 开发环境反向代理
```sh
nginx -t # /opt/homebrew/etc/nginx
nginx -s reload
```

```
server {
  listen       2999;
  server_name  localhost;
  location / {
      proxy_pass http://192.168.28.160:1111;
      add_header Access-Control-Allow-Origin *;
      add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS, DELETE, PUT';
      add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
      if ($request_method = 'OPTIONS') {
          return 204;
      }
  }
}
```

### TODO

- 加载中变化 currentPath, 取消上轮加载
- 同目录拖拽
- 方向选择目录
- 传输任务
- 传输速度
- 文件夹大小队列
- 设置/是否筛除隐藏文件
- 设置/重名文件检测 无操作|覆盖|保留
- grid 视图双行文件名
- 回到上级目录时，标记前目录
