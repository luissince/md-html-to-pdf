from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse
import requests
from src.services.html_service import HtmlService
from src.model.base.body import Body
import re
import os

router = APIRouter()

@router.post("/pdf")
async def pdf(body: Body):
    try:
        # Genera el HTML 
        html = HtmlService.convert_to_html(
            title=body.title, content=body.content, css=body.css
        )

        # Verifica si la URL de la API está configurada
        url = os.getenv("API_HTML_TO_PDF")
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
    except requests.exceptions.HTTPError as errh:
        print("HTTP Error:", errh)
        obj = {"code": 500, "message": "HTTP Error"}
        return JSONResponse(content=obj, status_code=obj["code"])
    except requests.exceptions.ConnectionError as errc:
        print("Connection Error:", errc)
        obj = {"code": 500, "message": "Connection Error"}
        return JSONResponse(content=obj, status_code=obj["code"])
    except requests.exceptions.Timeout as errt:
        print("Timeout Error:", errt)
        obj = {"code": 500, "message": "Timeout Error"}
        return JSONResponse(content=obj, status_code=obj["code"])
    except requests.exceptions.RequestException as err:
        print("Other Error:", err)
        obj = {"code": 500, "message": "Something went wrong"}
        return JSONResponse(content=obj, status_code=obj["code"])
    except Exception as err:
        print("Other Error:", err)
        obj = {"code": 500, "message": "Internal Server Error"}
        return JSONResponse(content=obj, status_code=obj["code"])

@router.post("/html")
async def html(body: Body):
    try:
        # Genera el HTML 
        html = HtmlService.convert_to_html(
            title=body.title, content=body.content, css=body.css
        )

        return html
    except requests.exceptions.HTTPError as errh:
        print("HTTP Error:", errh)
        obj = {"code": 500, "message": "HTTP Error"}
        return JSONResponse(content=obj, status_code=obj["code"])
    except requests.exceptions.ConnectionError as errc:
        print("Connection Error:", errc)
        obj = {"code": 500, "message": "Connection Error"}
        return JSONResponse(content=obj, status_code=obj["code"])
    except requests.exceptions.Timeout as errt:
        print("Timeout Error:", errt)
        obj = {"code": 500, "message": "Timeout Error"}
        return JSONResponse(content=obj, status_code=obj["code"])
    except requests.exceptions.RequestException as err:
        print("Other Error:", err)
        obj = {"code": 500, "message": "Something went wrong"}
        return JSONResponse(content=obj, status_code=obj["code"])
    except Exception as err:
        print("Other Error:", err)
        obj = {"code": 500, "message": "Internal Server Error"}
        return JSONResponse(content=obj, status_code=obj["code"])
