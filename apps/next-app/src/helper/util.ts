/**
 * Limpia una cadena HTML eliminando caracteres no deseados como comillas, saltos de línea y tabulaciones.
 *
 * @param {string} rawHtml - La cadena HTML sin procesar que se va a limpiar.
 * @returns {string} La cadena HTML limpia sin caracteres no deseados.
 */
export function cleanHtml(rawHtml: string): string {
    return rawHtml
        .replace(/^"(.*)"$/, '$1')
        .replace(/\\n/g, '')
        .replace(/\\"/g, '"')
        .replace(/\\t/g, '')
        .trim();
};

/**
 * Determina si un valor es numérico.
 *
 * @param {any} value - El valor a evaluar.
 * @returns {boolean} Verdadero si el valor es numérico, falso en caso contrario.
 */
export function isNumeric(value: any): boolean {
    return !isNaN(value) && !isNaN(parseFloat(value));
}

/**
 * Determina si un valor es una cadena de texto no vacía.
 *
 * @param {any} value - El valor a evaluar.
 * @returns {boolean} Verdadero si el valor es una cadena de texto no vacía, falso en caso contrario.
 */
export function isText(value: any): boolean {
    return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Determina si un objeto está vacío.
 *
 * @param {any} object - El objeto a evaluar.
 * @returns {boolean} Verdadero si el objeto está vacío, falso en caso contrario.
 */
export function isEmpty(object: any): boolean {
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

/**
 * Pausa la ejecución durante un tiempo especificado.
 *
 * @param {number} time - El tiempo en milisegundos durante el cual se pausará la ejecución.
 * @returns {Promise<void>} Una promesa que se resuelve después de que haya transcurrido el tiempo especificado.
 */
export function sleep(time: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Valida si una URL es válida.
 * 
 * @param {string} url - La URL a validar.
 * @returns {boolean} Si la url es valida retorna true, de lo contrario retorna false.
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}