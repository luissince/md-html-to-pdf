def core(title: str,html: str, css: str)->str:
    template = f"""
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                {css}
            </style>
            <title>{title}</title>
        </head>
        <body>
            {html}
        </body>
        </html>
        """
    return template