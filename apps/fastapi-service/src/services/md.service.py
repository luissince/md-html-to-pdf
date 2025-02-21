# processor.py
import markdown
import yaml
from pathlib import Path
import json
import requests

class MarkdownProcessor:
    def __init__(self):
        self.default_css = """
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #2c3e50;
            font-size: 32px;
            margin-bottom: 20px;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        h2 {
            color: #34495e;
            font-size: 24px;
            margin-top: 20px;
            margin-bottom: 15px;
        }
        h3 {
            color: #445566;
            font-size: 20px;
            margin-top: 15px;
        }
        p {
            margin-bottom: 15px;
            color: #333;
        }
        ul, ol {
            margin-bottom: 15px;
            padding-left: 25px;
        }
        li {
            margin-bottom: 5px;
        }
        code {
            background-color: #f7f9fa;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: monospace;
        }
        pre {
            background-color: #f7f9fa;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        blockquote {
            border-left: 4px solid #ccc;
            margin: 15px 0;
            padding-left: 15px;
            font-style: italic;
            color: #666;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 15px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
        }
        """

    def extract_front_matter(self, content):
        if content.startswith('---'):
            try:
                _, fm, content = content.split('---', 2)
                return yaml.safe_load(fm), content.strip()
            except:
                return {}, content
        return {}, content

    def process_markdown(self, input_file):
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extraer front matter y contenido
        front_matter, md_content = self.extract_front_matter(content)

        # Convertir MD a HTML
        html = markdown.markdown(
            md_content,
            extensions=['tables', 'fenced_code', 'codehilite']
        )

        # Preparar CSS
        css = self.default_css
        if 'css' in front_matter:
            try:
                with open(front_matter['css'], 'r') as f:
                    custom_css = f.read()
                    css = f"{css}\n{custom_css}"
            except:
                pass

        # Crear HTML con CSS incluido
        html_with_css = f"""
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                {css}
            </style>
            <title>Document</title>
        </head>
        <body>
            {html}
        </body>
        </html>
        """

        # Guardar resultado como HTML
        output_path = Path(input_file).with_suffix('.html')
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html_with_css)

        return output_path
if __name__ == "__main__":
    processor = MarkdownProcessor()
    processor.process_markdown("input.md")