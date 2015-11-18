# Node JS, Express, MongoDb, Jquery Mobile Proyecto Base

## Ambiente de Desarrollo

### Máquina Local

1. Chrome Browser con PostMan Extension instalado
2. Editor de Texto con capacidades de sync por ssh o cliente SFTP
3. Máquina Virtual con NodeJs, Mongo y express-generator instalado

## Pasos para adecuar el proyecto para conectarse a MongoDB
1. Crear el proyecto
   ```
   express --git --css less --hbs mejqmn
   cd mejqmn
   npm install
   npm install mongodb --save
   ```
2. Sincronizar carpeta a máquina local.
3. Modificar archivo bin/www
   ```javascript
    // /bin/www.js
    ...
    var http = require('http');
    var MongoClient = require('mongodb').MongoClient; //<--
    var mongourl = "mongodb://localhost:27017/mejqmn";//<--

    MongoClient.connect(mongourl, function(err, db){  //<--
        if(err){ onError(err);}                       //<--
        var app = require('../app')(db);              //<--
        /**
         * Get port from environment and store in Express.
         */
    ...
            : 'port ' + addr.port;
          debug('Listening on ' + bind);
        }

    });// MongoClient.connect                           <--
   ```
4. Modificar archivo app.js
   ```javascript
   // app.js
   ...
   var app = express();

   function getApp(db){                                 //<--
       // view engine setup
       app.set('views', path.join(__dirname, 'views'));
       app.set('view engine', 'hbs');
    ...
        app.use('/users', users);

        console.log("Conected To DB" + db.databaseName); //<--
        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
    ...
        app.use(function(err, req, res, next) {
          res.status(err.status || 500);
          res.render('error', {
            message: err.message,
            error: {}
          });
        });

        return app;                                     //<--
    }                                                   //<--
    //module.exports = app;
    module.exports = getApp;                            //<--

   ```

## Pasos para integrar jquery mobile al proyecto.
1. desacargar el archivo el ditribuible estable de jqueryMobile desde su página web
https://jquerymobile.com
2. Descomprimir el archivo
3. Copiar en la carpeta ```public/javascripts``` de su proyecto los siguiente archivos de la carpeta descomprimida
   * ```jquery.mobile.x.x.x/demos/js/jquery.min.js```
   * ```jquery.mobile.x.x.x/demos/js/jquery.mobile-x.x.x.min.js ```
4. Copiar en la carpeta ```public/stylesheets``` de su proyecto los siguientes archivo de la carpeta descomprimida
   * ```jquery.mobile.x.x.x/demos/css/themes/default/jquery.mobile-x.x.x.min.css```
5. Subir a la máquina virtual la carpeta public.
