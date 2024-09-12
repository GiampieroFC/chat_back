# Back


## Levantar la base de datos

> [!IMPORTANT]
> **Dependencias**
> Son necesarias las dependencias `docker-compose` y `docker`. Si no se tiene, se puede levantar la base de datos que prefieras y cambiar el _connect string_ de la base de datos.

1. Levanta la base de datos: `docker-compose up -d`
   - La base de datos que usamos es MongoDB. Puerto **27017**.
   - Y el administrador de la base de datos, mongo express corre en el puerto **8081**.

## Correr el backend

1. En modo de desarrollo: `dev start:dev` (después de levantar la base de datos)
   - El backend corre en el puerto 3000 de la aplicación.

## EndPoints y Postman

[https://documenter.getpostman.com/view/27708672/2sAXqndjDf](https://documenter.getpostman.com/view/27708672/2sAXqndjDf)

> [!CAUTION]
> **Docker deamon**
> Para no dejar el contenedor corriendo en sus máquinas, escriban `docker-compose down -v` en el terminal.

