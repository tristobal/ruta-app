Ruta del Sanguche App
=====================

Tentativa aplicación de la ruta del Sanguche.

# Requisitos
Con Node.js instalado; instalar globalmente ionic, bower y cordova:
```sh
npm install -g cordova ionic bower
```

# Instalación
```sh
git clone git@github.com:tristobal/ruta-app.git
cd ruta-app
npm install
bower install
cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-geolocation.git
ionic platform add <ios o android>
