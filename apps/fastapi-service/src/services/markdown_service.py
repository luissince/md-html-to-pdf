import markdown
import yaml
from src.core.html import core

class MarkdownService:
    # Variables de clase para almacenar configuraciones estáticas

    @staticmethod
    def extract_front_matter(content):
        if content.startswith('---'):
            try:
                _, fm, content = content.split('---', 2)
                return yaml.safe_load(fm), content.strip()
            except:
                return {}, content
        return {}, content

    @staticmethod
    def generate_html(title: str = 'Document', content: str = '', css: str = None):
        # Extraer front matter y contenido
        front_matter, md_content = MarkdownService.extract_front_matter(content)

        # Convertir MD a HTML
        html = markdown.markdown(
            md_content,
            extensions=['tables', 'fenced_code', 'codehilite']
        )
        
        # Crear HTML con CSS incluido
        return core(title=title, html=html, css=css)