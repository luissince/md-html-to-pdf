export const cleanHtml = (rawHtml: string) => {
    return rawHtml
        .replace(/^"(.*)"$/, '$1') // 🔥 Elimina comillas dobles al inicio y final
        .replace(/\\n/g, '')       // Elimina saltos de línea
        .replace(/\\"/g, '"')      // Reemplaza comillas escapadas
        .replace(/\\t/g, '')       // Elimina tabulaciones
        .trim();
};


export function isNumeric(valor: any) {
    return !isNaN(valor) && !isNaN(parseFloat(valor));
}

export function isText(value: any) {
    return typeof value === 'string' && value.trim().length > 0;
}

export function isEmpty(object: any) {
    if (object === null || typeof object === 'undefined') {
        return true;
    }

    if (Array.isArray(object) || object instanceof FileList) {
        return object.length === 0;
    }

    if (typeof object === 'string') {
        return object.trim() === '';
    }

    if (typeof object === 'object') {
        return Object.keys(object).length === 0;
    }

    return false;
}