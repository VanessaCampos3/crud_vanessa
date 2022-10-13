import {
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
    PORT,
  } from './config.js'
  
  
  
  
  import mysql from 'mysql2'
  import express from 'express'
  import bodyParser from 'body-parser'
  
  var app = express()
  
  var con = mysql.createConnection({
  
    host: DB_HOST,
    user: DB_USER,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
  
  })
  
  app.use(express.static('public'))
  
  con.connect()
  
  app.use(bodyParser.json())
  
  app.use(bodyParser.urlencoded({
      extended:true
  }))

  app.get('/', (req,res)=>{
    res.sendFile('./Public/index.html')
  })

app.post('/agregarAlumno',(req,res)=>{
    let nombre=req.body.nombre
    let calificacion=req.body.calificacion
    let descripcion=req.body.descripcion


    con.query('insert into tabladeposiciones(nombre, calificacion, descripcion) values("'+nombre+'", "'+calificacion+'", "'+descripcion+'")',(err,respuesta,fields)=>{

        if (err)return console.log("Error",err)

        return res.send(`
        <a href="index.html"><link rel="stylesheet" href="css/style.css">Inicio</a></a>
        <h1>Calificacion Registrada</h1>`)


    })

})


app.post('/borrarAlumno',(req,res)=>{
    let nombreAlumno=req.body.nombreAlumno;

    con.query('DELETE FROM tabladeposiciones where nombre=("'+nombreAlumno+'")',(err,respuesta,field)=>{
        if(err) return console.log('ERROR:',err)

        return res.send(`
        <a href="index.html"><link rel="stylesheet" href="css/style.css">Inicio</a></a>
        <h1>Usuario ${nombreAlumno} eliminado</h1>`)
    })
})

app.get('/getAlumnos',(req,res)=>{
    
    con.query('select nombre, calificacion, descripcion from tabladeposiciones order by calificacion desc',(err,respuesta,field)=>{
        if(err) return console.log('ERROR:',err)

        var userHTML=``
        var i=0
        console.log(respuesta)
        userHTML+=`
        <a href="index.html"><link rel="stylesheet" href="css/style.css">Inicio</a></a>
        `
        respuesta.forEach(user=>{
            i++
            userHTML+=`
            <tr><td>${i}</td><td>${user.nombre}</td><td>${user.calificacion}</td><td>${user.descripcion}</td></tr>
            `
        })

        var j=1
        j++
        return res.send(`<center><table>
            <tr>
                <th>Posición</h1>
                <th>Nombre </th>
                <th>Calificación </th>
                <th>Descripción </th>
            </tr>
            ${userHTML}
            </table></center>`)
    })
})

app.post('/updAlumno',(req,res)=>{
    let nombreA=req.body.nombreA;
    let nombreUpd=req.body.nombreUpd
    let calificacionUpd=req.body.calificacionUpd
    let descripcionUpd=req.body.descripcionUpd

    con.query('UPDATE tabladeposiciones SET nombre=("'+nombreUpd+'"), calificacion=("'+calificacionUpd+'"), descripcion=("'+descripcionUpd+'") WHERE nombre=("'+nombreA+'")',(err,respuesta,field)=>{
        if(err) return console.log('ERROR:',err)

        return res.send(`
        <a href="index.html"><link rel="stylesheet" href="css/style.css">Inicio</a></a>
        <h1>Usuario ${nombreA} editado exitosamente.</h1>
        `)
    })
})



app.listen(PORT,()=>{
    console.log("Servidor escuchando en el puerto ", PORT)
})