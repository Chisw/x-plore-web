# x-plore-web
UI for X-plore.apk

### 安装

安装 JDK https://www.oracle.com/java/technologies/javase-downloads.html
安装 Apktool https://ibotpeaches.github.io/Apktool/install/
安装 android-sdk brew install android-sdk

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
cd /Users/jsw/Library/Android/sdk/build-tools/31.0.0
./zipalign -v 4 [signed-v1.apk] [signed-v1-aligned.apk]
# ./zipalign -c -v 4 [signed-v1-aligned.apk]
./apksigner sign --ks [jswjks.jks] --ks-key-alias [jswjks] --out [signed-v2.apk] [signed-v1-aligned.apk]
# ./apksigner verify -v [signed-v2.apk]
```

### 开发环境反向代理
```
brew install nginx
nginx -t  // /opt/homebrew/etc/nginx
nginx -s reload
```

### 命令集

```sh
cd /usr/local/bin && java -jar apktool.jar b /Users/jsw/WSJ/X-Web/src && jarsigner -verbose -keystore /Users/jsw/Desktop/jsw.jks -signedjar /Users/jsw/WSJ/X-Web/src/dist/x-v1.apk /Users/jsw/WSJ/X-Web/src/dist/x.apk jsw && cd /Users/jsw/Library/Android/sdk/build-tools/31.0.0 && ./zipalign -v 4 /Users/jsw/WSJ/X-Web/src/dist/x-v1.apk /Users/jsw/WSJ/X-Web/src/dist/x-v1-aligned.apk && ./apksigner sign --ks /Users/jsw/Desktop/jsw.jks --ks-key-alias jsw --out /Users/jsw/WSJ/X-Web/src/dist/x-v2.apk /Users/jsw/WSJ/X-Web/src/dist/x-v1-aligned.apk && cd /Users/jsw/WSJ/X-Web/src/dist/ && zip x-v2.apk.zip /Users/jsw/WSJ/X-Web/src/dist/x-v2.apk
```
