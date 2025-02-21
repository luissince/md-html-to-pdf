from src.core.html import core

class HtmlService:

    @staticmethod
    def convert_to_html(title: str = '', content: str = '', css: str = None):
        # Crear HTML con CSS incluido
        return core(title=title, html=content, css=css)
    