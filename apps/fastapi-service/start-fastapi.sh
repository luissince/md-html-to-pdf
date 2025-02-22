#!/bin/bash

# Detectar el sistema operativo
OS_TYPE=$(uname)

# Activar el entorno virtual
if [ "$OS_TYPE" == "Darwin" ] || [ "$OS_TYPE" == "Linux" ]; then
    # macOS o Linux
    source venv/bin/activate
elif [ "$OS_TYPE" == "MINGW64_NT-10.0" ] || [ "$OS_TYPE" == "MSYS_NT-10.0" ]; then
    # Windows (Git Bash o similar)
    source venv/Scripts/activate
else
    echo "Sistema operativo no soportado"
    exit 1
fi

# Ejecutar FastAPI
# uvicorn app.main:app --host 0.0.0.0 --port 8000
fastapi dev main.py --host 0.0.0.0 --port 8001 