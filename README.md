# x-plore-web
Web UI for X-plore.apk

### 安装依赖

- 安装 JDK https://www.oracle.com/java/technologies/javase-downloads.html

```sh
brew tap adoptopenjdk/openjdk
brew install --cask adoptopenjdk8
sdkmanager "build-tools;30.0.0"
```

- 安装 Apktool https://ibotpeaches.github.io/Apktool/install/
- 安装 android-sdk `brew install android-sdk`
- 安装 Nginx `brew install nginx`

### 反编译

```sh
cd /usr/local/bin
java -jar apktool.jar d target.apk
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
      add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS, DELETE';
      add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
      if ($request_method = 'OPTIONS') {
          return 204;
      }
  }
}
```

### 命令集

```sh
cd /usr/local/bin && java -jar apktool.jar b /Users/Chisw/WSJ/x-plore-web/apk/X-plore && jarsigner -verbose -keystore /Users/Chisw/WSJ/x-plore-web/apk/123123.jks -signedjar /Users/Chisw/WSJ/x-plore-web/apk/X-plore/dist/x-v1.apk /Users/Chisw/WSJ/x-plore-web/apk/X-plore/dist/x.apk 123123 && cd /Users/Chisw/Library/Android/sdk/build-tools/30.0.0 && ./zipalign -v 4 /Users/Chisw/WSJ/x-plore-web/apk/X-plore/dist/x-v1.apk /Users/Chisw/WSJ/x-plore-web/apk/X-plore/dist/x-v1-aligned.apk && ./apksigner sign --ks /Users/Chisw/WSJ/x-plore-web/apk/123123.jks --ks-key-alias 123123 --out /Users/Chisw/WSJ/x-plore-web/apk/X-plore/dist/x-v2.apk /Users/Chisw/WSJ/x-plore-web/apk/X-plore/dist/x-v1-aligned.apk && cd /Users/Chisw/WSJ/x-plore-web/apk/X-plore/dist/ && zip x-v2.apk.zip /Users/Chisw/WSJ/x-plore-web/apk/X-plore/dist/x-v2.apk
```
