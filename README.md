# Desafio N°7 Refactor a nuestro login

## LEIBLICH Ezequiel Gaston

## Comisión 43345 - Programación Backend

En este proyecto, se realizó una refactorización del login del entregable anterior para incluir nuevos conceptos y funcionalidades. Se implementaron los siguientes aspectos:

1- Hasheo de contraseña utilizando bcrypt: Se aplicó una técnica de hasheo de contraseñas utilizando la biblioteca bcrypt. Esto permitió almacenar las contraseñas de forma segura en la base de datos, evitando el almacenamiento de las contraseñas en texto plano. De esta manera, se garantizó una mayor seguridad en la autenticación de los usuarios.

2- Implementación de Passport: Se integró el framework de autenticación Passport en el proyecto. Se utilizó Passport tanto para el registro como para el login de los usuarios. Esta integración facilitó la gestión de las sesiones y la autenticación de forma segura. Passport proporcionó una capa de abstracción que simplificó el proceso de autenticación, permitiendo un manejo eficiente de las credenciales de usuario y asegurando la integridad de la información.

3- Método de autenticación de GitHub: Se implementó el método de autenticación de GitHub en la vista de login. Esto permitió a los usuarios autenticarse utilizando sus credenciales de GitHub en lugar de un registro tradicional. Al hacer clic en la opción de inicio de sesión con GitHub, se redirigía al usuario a la página de autorización de GitHub, donde se le solicitaba permiso para acceder a su cuenta. Una vez autorizado, se creaba una sesión de usuario con los datos proporcionados por GitHub. Esta funcionalidad mejoró la experiencia de inicio de sesión, ofreciendo a los usuarios una opción alternativa y práctica para acceder a la plataforma.

En resumen, el trabajo consistió en la refactorización del login del entregable anterior para incluir nuevos conceptos y funcionalidades. Se implementó el hasheo de contraseña utilizando bcrypt para garantizar la seguridad de las contraseñas almacenadas. Se integró Passport como framework de autenticación, lo que permitió un manejo eficiente de las sesiones y la autenticación segura de los usuarios. Además, se implementó el método de autenticación de GitHub en la vista de login, brindando a los usuarios la opción de iniciar sesión utilizando sus credenciales de GitHub. Estas mejoras fortalecieron la seguridad y la accesibilidad del sistema de login, proporcionando una experiencia de usuario más robusta y versátil.