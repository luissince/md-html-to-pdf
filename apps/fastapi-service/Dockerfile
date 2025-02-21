# Usar una imagen base de Debian Slim
FROM debian:bullseye-slim

# Configurar variables de entorno
ENV LANG C.UTF-8
ENV DEBIAN_FRONTEND=noninteractive

# Etiqueta de la versión del imagen
LABEL version="1.0.0"

# Actualizar el índice de paquetes e instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    wget \
    build-essential \
    libssl-dev \
    zlib1g-dev \
    libncurses5-dev \
    libncursesw5-dev \
    libreadline-dev \
    libsqlite3-dev \
    libgdbm-dev \
    libdb5.3-dev \
    libbz2-dev \
    libexpat1-dev \
    liblzma-dev \
    libffi-dev \
    uuid-dev \
    tk-dev \
    && rm -rf /var/lib/apt/lists/*

# Descargar e instalar Python 3.12.0
RUN wget https://www.python.org/ftp/python/3.12.0/Python-3.12.0.tgz \
    && tar xzf Python-3.12.0.tgz \
    && cd Python-3.12.0 \
    && ./configure --enable-optimizations \
    && make -j$(nproc) \
    && make altinstall \
    && cd .. \
    && rm -rf Python-3.12.0 Python-3.12.0.tgz

# Instalar pip
RUN wget https://bootstrap.pypa.io/get-pip.py \
    && python3.12 get-pip.py \
    && rm get-pip.py

# Establecer Python 3.12 como la versión predeterminada
RUN update-alternatives --install /usr/bin/python3 python3 /usr/local/bin/python3.12 1

# Directorio de trabajo
WORKDIR /app

# Copiar el archivo requirements.txt al directorio actual
COPY requirements.txt .

# Instalar las dependencias desde requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto 80 del contenedor
EXPOSE 80

# Comando para ejecutar la aplicación
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
# CMD ["fastapi", "run", "app/main.py", "--port", "80"]