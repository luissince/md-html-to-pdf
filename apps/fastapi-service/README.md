# MD TO HTML

Este proyecto convierte que convierte un archivo md a html o un html lo une con su css.

## Características

- Convierte un contenido de md a html.
- Unifica un html con su css a un html

## Requisitos

- Python 3.7 o superior

## Configuración

### 1. Clona el repositorio

Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

### 2. Crea y activa un entorno virtual

Es una buena práctica utilizar un entorno virtual para gestionar las dependencias del proyecto.

#### Crear el entorno virtual

Ejecuta el siguiente comando para crear el entorno virtual en la carpeta `venv`:

```bash
python3 -m venv venv
```

#### Activar el entorno virtual

- **En Windows:**

    ```bash
    venv\Scripts\activate
    ```

- **En macOS/Linux:**

  ```bash
  source venv/bin/activate
  ```

#### Verificando si estás en el entorno virtual

- Si no estás seguro si activaste el entorno virtual, ejecuta:

    ```bash
    # En Linux/macOS
    which python  
    
    # En Windows
    where python  
    ```

Cuando el entorno virtual esté activo, deberías ver el prefijo `(venv)` en la terminal.

#### Desactivar el entorno virtual

Para salir del entorno virtual, simplemente usa el comando:

```bash
deactivate
```

### 3. Instala las dependencias

Instala las dependencias necesarias para el proyecto:

```bash
pip install -r requirements.txt
```

### 4. Configura las variables de entorno

Si necesitas almacenar configuraciones como idioma o claves de API, puedes usar un archivo `.env`. 

Crea un archivo `.env` en la raíz del proyecto y añade tus variables de configuración:

```dotenv
PORT=80
ORIGIN=*
```

### 6. Ejecuta el script

Una vez configurado todo, puedes ejecutar el script principal de la aplicación:

```bash
fastapi dev main.py --port 8001 
```

### 7. Generar los paquetes de la aplicación a usar

Para crear un listado de los paquetes instalados en el ambiente virtual, puedes ejecutar el siguiente comando:

```bash
pip freeze > requirements.txt
```

### 8. Desplegar en un contenedor Docker en modo desarrollo

```bash
# Desplegar el contenedor
docker-compose -f docker-compose.dev.yml up --build -d

# Detener el contenedor
docker-compose -f docker-compose.dev.yml down
```

### 9. Ejecutar los tests unitarios
    
```bash
npm run test  
```

## Contribuciones

¡Las contribuciones son bienvenidas! Si deseas colaborar, realiza un fork del repositorio, crea una rama para tu característica y envía un pull request.

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

Este README ahora incluye instrucciones completas sobre cómo crear, activar y desactivar el entorno virtual, proporcionando todos los detalles para empezar el proyecto correctamente.