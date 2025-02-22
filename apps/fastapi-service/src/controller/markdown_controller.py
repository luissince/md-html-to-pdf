from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse
import requests
from src.services.markdown_service import MarkdownService
from src.model.base.body import Body
import re
import os
import logging

router = APIRouter()

# Configurar el registro
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/pdf")
async def pdf(body: Body):
    try:
        # Genera el HTML desde Markdown
        html = MarkdownService.generate_html(
            title=body.title, content=body.content, css=body.css
        )

        # Verifica si la URL de la API está configurada
        url = os.getenv("API_HTML_TO_PDF") + "/pdf"
        if not url:
            return JSONResponse(
                content={"code": 500, "message": "API_HTML_TO_PDF no configurado"},
                status_code=500,
            )
            
        # Datos para la solicitud
        payload = {
            "title": body.title,
            "html": html,
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
    except requests.exceptions.HTTPError as error:
        logger.error(f"HTTP Error: {error}")
        obj = {"code": 500, "message": f"HTTP Error: {str(error)}"}
        return JSONResponse(content=obj, status_code=obj["code"])

    except requests.exceptions.ConnectionError as errc:
        logger.error(f"Connection Error: {errc}")
        obj = {"code": 500, "message": f"Connection Error: {str(errc)}"}
        return JSONResponse(content=obj, status_code=obj["code"])

    except requests.exceptions.Timeout as errt:
        logger.error(f"Timeout Error: {errt}")
        obj = {"code": 500, "message": f"Timeout Error: {str(errt)}"}
        return JSONResponse(content=obj, status_code=obj["code"])

    except requests.exceptions.RequestException as err:
        logger.error(f"Request Exception: {err}")
        obj = {"code": 500, "message": f"Request Exception: {str(err)}"}
        return JSONResponse(content=obj, status_code=obj["code"])

    except Exception as err:
        logger.error(f"Unexpected Error: {err}", exc_info=True)
        obj = {"code": 500, "message": f"Internal Server Error: {str(err)}"}
        return JSONResponse(content=obj, status_code=obj["code"])

@router.post("/html")
async def html(body: Body):
    try:
        # Genera el HTML desde Markdown
        html = MarkdownService.generate_html(
            title=body.title, content=body.content, css=body.css
        )

        return html
    except requests.exceptions.HTTPError as error:
        logger.error(f"HTTP Error: {error}")
        obj = {"code": 500, "message": f"HTTP Error: {str(error)}"}
        return JSONResponse(content=obj, status_code=obj["code"])

    except requests.exceptions.ConnectionError as errc:
        logger.error(f"Connection Error: {errc}")
        obj = {"code": 500, "message": f"Connection Error: {str(errc)}"}
        return JSONResponse(content=obj, status_code=obj["code"])

    except requests.exceptions.Timeout as errt:
        logger.error(f"Timeout Error: {errt}")
        obj = {"code": 500, "message": f"Timeout Error: {str(errt)}"}
        return JSONResponse(content=obj, status_code=obj["code"])

    except requests.exceptions.RequestException as err:
        logger.error(f"Request Exception: {err}")
        obj = {"code": 500, "message": f"Request Exception: {str(err)}"}
        return JSONResponse(content=obj, status_code=obj["code"])

    except Exception as err:
        logger.error(f"Unexpected Error: {err}", exc_info=True)
        obj = {"code": 500, "message": f"Internal Server Error: {str(err)}"}
        return JSONResponse(content=obj, status_code=obj["code"])