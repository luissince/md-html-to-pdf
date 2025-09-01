from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.controller import markdown_controller, html_controller, url_controller

load_dotenv()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    openapi_url="/openapi.json",
    redoc_url=None,
    docs_url="/docs",
)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(markdown_controller.router, prefix="/markdown", tags=["MarkDown"])
app.include_router(html_controller.router, prefix="/html", tags=["HTML"])
app.include_router(url_controller.router, prefix="/url", tags=["URL"])


@app.get("/", tags=["root"])
def index():
    return JSONResponse({"message": "MD TO PDF"})
