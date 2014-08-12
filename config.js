module.exports.API_KEY = 'key-6qs9-0ys1442ifjlfzast63062dpe2n1';
module.exports.DOMAIN = 'yuichidev.mailgun.org';

var dbname = 'telegram';
module.exports.dbHost_dbName = '127.0.0.1/'+dbname;
// module.exports.dbHost = '127.0.0.1';
// module.exports.dbName = 'telegram';
module.exports.port 	= 3000;

// http://yhagio.github.io/blog/2014/06/12/nginx-setup/
// server {
//   listen 80;
//   root /home/ubuntu/telegram-cli/dist;
//   index index.html;

//   location /api {
//     proxy_pass http://127.0.0.1:3000;
//   }

//   location / {
//     try_files $uri $uri/ /index.html;
//   }
// }