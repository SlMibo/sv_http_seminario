const http = require("http");
const url = require("url");
const nodemailer = require('nodemailer');
const fs = require('fs');


// -----------------------CONFIGURACIÓN DEL SERVIDOR-------------------------------

// const servidor=http.createServer((req,res) => {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write(`<!doctype html><html><head></head><body><h1>Sitio en desarrollo</h1></body></html>`);
//     res.end();
// });

const servidor=http.createServer((req,res) => {
    const objetourl = url.parse(pedido.url);
    let camino='./'+objetourl.pathname;
    if (camino=='/')
        camino='/index.html';
    fs.stat(camino, error => {
        if (!error) {
        fs.readFile(camino, (error,contenido) => {
            if (error) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.write('Error interno');
            res.end();					
            } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(contenido);
            res.end();
        }
      });
    } else {
      res.writeHead(404, {'Content-Type': 'text/html'});
      res.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
      res.end();
    }
  });
});
  
servidor.listen(3000);
  
console.log('Servidor web iniciado');

//----------------------CREACIÓN DEL ARCHIVO-------------------------------------
function text(){
    const data = new Uint8Array(Buffer.from('Texto de ejemplo'));
    fs.writeFile('./text.txt', data, (err)=>{
        if(err) throw err;
        console.log('El archivo se ha creado');  
    })
}


//----------------------------ENVÍO DE EMAIL---------------------------------------
async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    const content = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        html: "<b>Hello world?</b>", // html body
    }

    if(fs.existsSync('./text.txt')){
        content.attachments = [{
            path: './text.txt'
        }]
        content.text = "Se adjuntó el archivo";
    } else {
        content.text = "No existe el archivo"
    }
    
  
    // send mail with defined transport object
    let info = await transporter.sendMail(content);

  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...


    // ----------INTENTO DE MOSTRAR EL LINK GENERADO POR NODEMAILER
    // EN sendMail.html, PERO DA ERROR 'document is not defined'

    // let linkMail = "Preview URL: %s"+ nodemailer.getTestMessageUrl(info)
    // const divMail = document.getElementById('linkMail').textContent;
    // divMail = linkMail;
}
  
main().catch(console.error);

