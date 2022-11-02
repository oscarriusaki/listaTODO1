# Nota:

1. Primeramente crear la base de datos y hacer funcionar en MYSQL
2. Crear la base de datos y las tablas copiando desde el archivo "BaseDeDatos.txt" o copear lo siguiente

```

/* creando base de datos */

create database gestionar;

/* creando tabla usuario */

create table usuario (

	id_usuario int auto_increment,
	nombre varchar(50) not null,
	pass text not null,
    correo text not null unique,
	token text not null,
	fecha date not null,
	estado int not null,
	constraint pk_id_usuario primary key (id_usuario)

);

/* insertar un registro */

insert into usuario (nombre, correo, pass, token, fecha, estado) values ("oscar", "oscar@gmail.com", "123", 1, "2022/11/2","1");

/* crear tabla tarea */

create table tarea (

    id_tarea int auto_increment not null,
    titulo varchar(50) not null,
    descripcion text not null,
    fecha date not null,
    estado int not null,
    finalizada int not null,
    id_usuario int not null,

    constraint pk_id_tarea primary key (id_tarea),
    constraint fk_id_usuario foreign key (id_usuario) references usuario(id_usuario)

);

/* insertando tarea */

insert into tarea (titulo, descripcion, finalizada, id_usuario, estado, fecha) values ( "task1", "this is the first task", 1, 1, 1, "2022/10/29" );
```

3. Clonar la carpeta

```
git clone https://github.com/oscarriusaki/listaTODO1.git
```

4. Con la terminal ingresar dentro de la carpeta clonada

```
cd listaTODO1
```

5. Para descargar los packetes en la terminal escribir

```
npm install
```

6. Finalmente escribir

```
nodemon app
```

7. Porfavor siga los pasos que se les mensiono de lo contrario no funcionara el programa grasias
   ahora puede hacer pruebas de error o registrar otros usuarios, hacer login etc. con algun programa,
   recomendado POSTMAN u otro.

8. Recomendar crear otro usuario, no usar el usuario creado en el paso 2 grasias.
9. Cualquier duda del codigo porfavor comunicarse con el desarollador BACKEND.
