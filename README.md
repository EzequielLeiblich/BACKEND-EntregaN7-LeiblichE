# ProyectoFinal-PreEntrega2-Backend-LeiblichE

## Proyecto de Ecommerce
Este repositorio contiene el proyecto de Ecommerce que ha sido desarrollado como parte de un trabajo terminado. Se han realizado cambios en la persistencia de la base de datos y se han agregado nuevos endpoints para mejorar la funcionalidad del sistema.

## Objetivos
El objetivo principal del proyecto es profesionalizar la gestión de la base de datos utilizando MongoDB como sistema de persistencia principal. Además, se han definido todos los endpoints necesarios para trabajar con productos y carritos.

## Objetivos específicos
Profesionalizar las consultas de productos implementando filtros, paginación y ordenamientos.
Mejorar la gestión de los carritos de compra mediante la implementación de los últimos conceptos aprendidos.
Repositorio
Puedes acceder al repositorio de este proyecto en el siguiente enlace: [Enlace al repositorio](https://github.com/EzequielLeiblich/ProyectoFinal-PreEntrega2-Backend-LeiblichE)

Recordar que el repositorio no incluye la carpeta node_modules.

## Instrucciones
A continuación, se detallan las tareas que se realizaron:

1. Modificar el método GET / para que cumpla con los siguientes requisitos:

        a. Debe poder recibir los siguientes parámetros de consulta (query params): limit (opcional), page (opcional), sort (opcional) y query (opcional).
        b. El parámetro limit permite devolver solo el número de elementos solicitados en la petición. Si no se recibe este parámetro, el valor predeterminado será 10.
        c. El parámetro page permite especificar la página que se desea buscar. Si no se recibe este parámetro, se utilizará la página 1.
        d. El parámetro query indica el tipo de elemento que se desea buscar. En caso de no recibir este parámetro, se realizará una búsqueda general.
        e. El parámetro sort permite realizar un ordenamiento ascendente (asc) o descendente (desc) por precio. Si no se recibe este parámetro, no se realizará ningún ordenamiento.
        f. El método GET debe devolver un objeto con el siguiente formato:
            {
              status: "success" or "error",
              payload: [Resultado de los productos solicitados],
              totalPages: Total de páginas,
              prevPage: Página anterior,
              nextPage: Página siguiente,
              page: Página actual,
              hasPrevPage: Indicador de existencia de página anterior,
              hasNextPage: Indicador de existencia de página siguiente,
              prevLink: Enlace directo a la página previa (null si hasPrevPage=false),
              nextLink: Enlace directo a la página siguiente (null si hasNextPage=false)
            }

2. Implementar la capacidad de buscar productos por categoría o por disponibilidad, y permitir el ordenamiento ascendente o descendente por precio.

3. Agregar los siguientes endpoints al router de carritos (carts):
        
        a. DELETE api/carts/:cid/products/:pid: Eliminará el producto seleccionado del carrito.
        b. PUT api/carts/:cid: Actualizará el carrito con un arreglo de productos en el formato especificado anteriormente.
        c. PUT api/carts/:cid/products/:pid: Actualizará únicamente la cantidad de ejemplares del producto, utilizando la cantidad proporcionada en req.body.
        d. DELETE api/carts/:cid: Eliminará todos los productos del carrito.

4. Realizar modificaciones en el modelo de carritos (Carts):

        a. En la propiedad products, el ID de cada producto generado dentro del array debe hacer referencia al modelo de productos (Products).
        b. Modificar la ruta /:cid para que al traer todos los productos, se incluyan los detalles completos de cada producto utilizando el método "populate".
           Esto significa que almacenaremos solo el ID de los productos en el carrito, pero al solicitarlos, podremos obtener los productos completos asociados.

5. Crear una vista en el router de vistas (views) en la ruta /products para visualizar todos los productos con su respectiva paginación.
  Cada producto mostrado puede resolverse de dos formas:

        a. Llevar a una nueva vista con el producto seleccionado y mostrar su descripción completa, detalles de precio, categoría, etc.