# README OPEN MRV / MOBILUS

Tivemos que adicionar a biblioteca 'google-analytics', porém a mesma é causadora de problemas com versões constantemente, segundo a comunidade.

O plugin depende de uma compatibilidade da versão do GOOGLE PLAY SERVICES, juntamente com os outros plugins. Ou seja, se as versões do GOOGLE PLAY SERVICES dos outros plugins não estão sincronizadas, bem provável que a partir do momento que instalar o plugin dará esse erro.

Para resolver o problema, devemos atualizar as versões dos apps e depois instalar o plug-in "cordova-plugin-androidx" e depois o "cordova-plugin-androidx-adapter"

## Versões

Package                           Version

-----------------------------------------------------------
cordova                           9.0.0 (cordova-lib@9.0.1)
ionic                             5.4.16
Angular CLI                       7.0.7
Node                              12.16.1
Angular                           7.0.4
@angular-devkit/architect         0.10.7
@angular-devkit/build-angular     0.10.7
@angular-devkit/build-optimizer   0.10.7
@angular-devkit/build-webpack     0.10.7
@angular-devkit/core              7.0.7
@angular-devkit/schematics        7.0.7
@angular/animations               7.2.16
@angular/cli                      7.0.7
@angular/fire                     5.4.2
@ngtools/webpack                  7.0.7
@schematics/angular               7.0.7
@schematics/update                0.10.7
rxjs                              6.3.3
typescript                        3.1.6
webpack                           4.19.1

## Chaves de api google maps

app-ios-homologacao - AIzaSyD2Z_5B18pHWxhds56pLUHWX1o8fYhrICo

app-android-homologacao - AIzaSyDz2fcxNslYEkkK8ceiTZKb4UM_rRpPUAs

app-android-producao - IzaSyAKsh1zZ1It3kErOfYArv9vdHFBMwRm0tE

app-ios-producao - AIzaSyCRoahtUduAKGUjrCAEGjFlwHaKKTuMwZY

## Chaves antigas

app-ios - AIzaSyD9zmTzGfGxWO_DcVsjvpFJ79_YMepgFyo

app-android AIzaSyBQVmeExrpMoiZ6rYO-Jq18BiOLMYkQZ58

# Acessos Lojas

## Repositorio
freela.app@agenciaopen.com
@henko#2020

## Android Developer

infraestrutura@agenciaopen.com
Felipe@260118

## iOS Developer

infraestrutura@agenciaopen.com
AgenciaOpen@2019

## Firebase e GCP

mapasmrv.mrv@gmail.com
sapam@apt0s
E-mail de recuperação: ricardo.araujo@agenciaopen.com

# Start, build and deploy

Para buildar o projeto ionic, rode os comandos:

Para instalar pacotes
```npm install```
```ionic cordova build --prod --release```

```
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "C:\Develop\Henko\MRVAPP\mrv-imoveis\my-release-key.keystore" "C:\Develop\Henko\MRVAPP\mrv-imoveis\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" alias_name
```

Alias name: alias_name
Password: open1404

./zipalign -v 4 "C:\Develop\Henko\MRVAPP\mrv-imoveis\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" compreummrv_1.2.16.apk

keytool -list -v -keystore C:\Users\Phadawan\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android

Splash

Nome da imagem: splash.png
Resolução: 2732 x 3732

Nome da imagem: Default@2x~universal~anyany.png
Resolução: 2732 x 2732

Nome da imagem: Default~iphone.png
Resolução: 320 x 480

Nome da imagem: Default2x~iphone.png
Resolução: 640 x 960

Nome da imagem: Default2x~universal~anyany.png
Resolução: 2732 x 2732

Nome da imagem: Default-568h@2x~iphone.png
Resolução: 640 x 1136

Nome da imagem: Default-568h2x~iphone.png
Resolução: 640 x 1136

Nome da imagem: Default-667h.png
Resolução: 750 x 1334

Nome da imagem: Default-736h.png
Resolução: 1242 x 2208

Nome da imagem: Default-1792h~iphone.png
Resolução: 828 x 1792

Nome da imagem: Default-2436h.png
Resolução: 1125 x 2436

Nome da imagem: Default-2688h~iphone.png
Resolução: 1242 x 2688

Nome da imagem: Default-Landscape@~ipadpro.png
Resolução: 2732 x 2048

Nome da imagem: Default-Landscape@2x~ipad.png
Resolução: 2048 x 1536

Nome da imagem: Default-Landscape~ipad.png
Resolução: 1024 x 768

Nome da imagem: Default-Landscape~ipadpro.png
Resolução: 2732 x 2048

Nome da imagem: Default-Landscape2x~ipad.png
Resolução: 2048 x 1536

Nome da imagem: Default-Landscape-736h.png
Resolução: 2208 x 1242

Nome da imagem: Default-Landscape-1792h~iphone.png
Resolução: 1792 x 828

Nome da imagem: Default-Landscape-2436h.png
Resolução: 2436 x 1125

Nome da imagem: Default-Landscape-2688h~iphone.png
Resolução: 2688 x 1242

Nome da imagem: Default-Portrait@~ipadpro.png
Resolução: 2048 x 2732

Nome da imagem: Default-Portrait@2x~ipad.png
Resolução: 1536 x 2048

Nome da imagem: Default-Portrait~ipad.png
Resolução: 768 x 1024

Nome da imagem: Default-Portrait~ipadpro.png
Resolução: 2048 x 2732

Nome da imagem: Default-Portrait2x~ipad.png
Resolução: 1536 x 2048

Icons

Nome da imagem: icon_applestore.png
Resolução: 1024 x 1024

Nome da imagem: icon-40-2x.png
Resolução: 80 x 80

Nome da imagem: icon-44x44.png
Resolução: 44 x 44

Nome da imagem: icon-50-2x.png
Resolução: 100 x 100

Nome da imagem: icon-55.png
Resolução: 55 x 55

Nome da imagem: icon-57.png
Resolução: 57 x 57

Nome da imagem: icon-57@2x.png
Resolução: 114 x 114

Nome da imagem: icon-57-2x.png
Resolução: 114 x 114

Nome da imagem: icon-58.png
Resolução: 58 x 58

Nome da imagem: icon-60-2x.png
Resolução: 120 x 120

Nome da imagem: icon-60-3x.png
Resolução: 180 x 180

Nome da imagem: icon-72-2x.png
Resolução: 144 x 144

Nome da imagem: icon-76-2x.png
Resolução: 152 x 152

Nome da imagem: icon-87.png
Resolução: 87 x 87

Nome da imagem: icon-167.png
Resolução: 167 x 167

Notification - Icone que aparece em push notifications, geralmente é feito em uma cor única e bem minimalista

Nome da imagem: drawable-hdpi/notification_icon.png
Resolução: 36 x 36

Nome da imagem: drawable-mdpi/notification_icon.png
Resolução: 24 x 24

Nome da imagem: drawable-xhdpi/notification_icon.png
Resolução: 48 x 48

Nome da imagem: drawable-xxhdpi/notification_icon.png
Resolução: 72 x 72

Nome da imagem: drawable-xxxdpi/notification_icon.png
Resolução: 96 x 96
