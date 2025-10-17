# Concurso Poder Judicial de Neuquén - Desarrollador de aplicaciones jr. - 
#### Chrobak, Mario Alejandro

Trabajo realizado para el concurso "Desarrollador de aplicaciones jr." del Poder Judicial de Neuquén.


## Ejecución del Proyuecto
Para instalar todas las dependencias que utiliza el proyecto será necesario por **única vez** ejecutar ``npm install`` dentro de cada directorio del proyecto, a saber, el directorio raíz del poryetco (pjn20205 tras la clonación de guithub), el directorio ``./frontend`` y el directorio ``./backend``.

Para ejecutar esta aplicacion en modo desarrollo, se debe ejecutar el comando ``npm run dev`` sobre el directorio raíz del proyecto.

### Aclaraciones
En en caso de al ABM de empleados, y con el objeto de mantener la integridad de la base de datos, se optó por implementar la **no** eliminación de un empleado en caso de que exista un historial de traslados asociado al mismo. 
Se consideró adicionalmente eliminar el historial junto con el empleado, y esa implementación se encuentra comentada en el controlador, esto se peude observar en el archivo del backend ``/backend/controllers/empleados.controller.ts`` en la línea 78:
```js
// Opción 1: No eliminar al empleado cuando tiene historial de traslados

const countHistorial = await historialRepo.count({ where: { empleado: { id } } });
if (countHistorial > 0) {
return res.status(400).json({ message: 'No se puede eliminar el empleado porque tiene historial de traslados.' });
}


// Opción 2: Eliminar al empleado y todos su historial de traslados
/*

await historialRepo.delete({empleado : {id}})
await empleadoRepo.remove(empleado);

*/
```

### *Docker*
Se han subido las imágenes de Docker del proyecto al siguiente repositorio público
- [Repositorio DockerHub](https://hub.docker.com/repositories/mariochrobak)

En el directorio ``/dockerized`` del proyecto se incluye el archivo ``docker-compose.yml`` para obtener las imagenes y ejecutar el proyecto con ejecutando el comando ``docker-compose up`` desde una consola y situado en dcho directorio.

En dichas imágenes se ha incluido una base de datos con información de muestra para el proyecto y no se utiliza una base de datos en memoria. Esto se puede cambiar en la versión de desarrollo para acceder a los mismos datos modificando las lineas 10, 11 y 12 del archivo ``/backend/src/data-sources.ts``. 

``Base de datos en memoria``
```js
database: ':memory:',  
//database: './src/pjn.db', // Se adjunta base con datos de prueba para el modo de desarrollo
synchronize: true,  // ¡No usar en producción!
```

``Para activar la base de datos incluída``
```js
//database: ':memory:',  
database: './src/pjn.db', // Se adjunta base con datos de prueba para el modo de desarrollo
synchronize: false,  // ¡No usar en producción!
```
