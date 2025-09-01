from fastapi import Response
import markdown
import yaml
from src.core.html import core
from fastapi.responses import JSONResponse
from src.model.base.body import Body
import requests
import re
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def pdf(body: Body):
    try:
        # Verifica si la URL de la API está configurada
        url = os.getenv("API_HTML_TO_PDF") + "/url-to-pdf"
        if not url:
            return JSONResponse(
                content={"code": 500, "message": "API_HTML_TO_PDF no configurado"},
                status_code=500,
            )
            
        # Datos para la solicitud
        payload = {
            "title": body.title,
            "html": "",
            "url": body.url,
            "size": body.size.value if body.size is not None else None,
            "width": None if body.size is not None else  body.width,
            "height": None if body.size is not None else  body.height,
            "margin": body.margin.__dict__,
        }
        
        # Cabeceras
        headers = {
            "Content-Type": "application/json",
        }
        
                # Realiza la solicitud POST
        response = requests.post(url=url, headers=headers, json=payload)
        response.raise_for_status()

        content_type = response.headers.get("Content-Type", "")
        
        # Nombre del archivo desde la respuesta
        content_disposition = response.headers.get("Content-Disposition", "")
        match = re.search(r'filename="?([^";]+)"?', content_disposition)
        filename = match.group(1).strip() if match else "documento.pdf"
        
        # Configurar las cabeceras de respuesta
        headers = {
            "Content-Type": content_type,
            "Content-Disposition": f'inline; filename="{filename}"',
            "Content-Length": str(len(response.content)),
        }

        # Retorna el PDF
        return Response(
            content=response.content,
            headers=headers,
            media_type="application/pdf",
        )
    except Exception as err:
        logger.error(f"Unexpected Error: {err}", exc_info=True)
        obj = {"code": 500, "message": f"Internal Server Error: {str(err)}"}
        return JSONResponse(content=obj, status_code=obj["code"])