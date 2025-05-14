import { Pdf } from "./definitions";

export const fetchMarkDownConvertPdf = async (body: Pdf): Promise<string> => {
    try {
        // Opciones de la solicitud fetch
        const options = {
            method: 'POST', // Especifica el método POST
            headers: {
                'Content-Type': 'application/json', // Especifica el tipo de contenido como JSON
                // Puedes agregar otros encabezados aquí, como autorización, si es necesario
            },
            body: JSON.stringify(body), // Convierte los datos a una cadena JSON
            next: { revalidate: 0 }
        };

        // Realizar la solicitud HTTP
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACK_END}/markdown/pdf`, options);

        // Verificar si la respuesta es correcta
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Obtiene la respuesta en formato blob
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // retorna la URL del PDF
        return url;
    } catch (error) {
        throw error;
    }
}

export const fetchMarkDownConvertHtml = async (body: Pdf): Promise<string> => {
    try {
        // Opciones de la solicitud fetch
        const options = {
            method: 'POST', // Especifica el método POST
            headers: {
                'Content-Type': 'application/json', // Especifica el tipo de contenido como JSON
                // Puedes agregar otros encabezados aquí, como autorización, si es necesario
            },
            body: JSON.stringify(body), // Convierte los datos a una cadena JSON
            next: { revalidate: 0 }
        };

        // Realizar la solicitud HTTP
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACK_END}/markdown/html`, options);

        // Verificar si la respuesta es correcta
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // retorna el contenido HTML
        return await response.text();
    } catch (error) {
        throw error;
    }
}

export const fetchHtmlConvertPdf = async (body: Pdf): Promise<string> => {
    try {   
        // Opciones de la solicitud fetch
        const options = {
            method: 'POST', // Especifica el método POST
            headers: {
                'Content-Type': 'application/json', // Especifica el tipo de contenido como JSON
                // Puedes agregar otros encabezados aquí, como autorización, si es necesario
            },
            body: JSON.stringify(body), // Convierte los datos a una cadena JSON
            next: { revalidate: 0 }
        };

        // Realizar la solicitud HTTP
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACK_END}/html/pdf`, options);

        // Verificar si la respuesta es correcta
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Obtiene la respuesta en formato blob
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // retorna la URL del PDF
        return url;
    } catch (error) {
        throw error;
    }
}

export const fetchHtmlConvertHtml = async (body: Pdf): Promise<string> => {
    try {
        // Opciones de la solicitud fetch
        const options = {
            method: 'POST', // Especifica el método POST
            headers: {
                'Content-Type': 'application/json', // Especifica el tipo de contenido como JSON
                // Puedes agregar otros encabezados aquí, como autorización, si es necesario
            },
            body: JSON.stringify(body), // Convierte los datos a una cadena JSON
            next: { revalidate: 0 }
        };

        // Realizar la solicitud HTTP
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACK_END}/html/html`, options);

        // Verificar si la respuesta es correcta
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // retorna el contenido HTML
        return await response.text();
    } catch (error) {
        throw error;
    }
}

export const fetchUrlConvertPdf = async (body: Pdf): Promise<string> => {
    try {
        // Opciones de la solicitud fetch
        const options = {
            method: 'POST', // Especifica el método POST
            headers: {
                'Content-Type': 'application/json', // Especifica el tipo de contenido como JSON
                // Puedes agregar otros encabezados aquí, como autorización, si es necesario
            },
            body: JSON.stringify(body), // Convierte los datos a una cadena JSON
            next: { revalidate: 0 }
        };

        // Realizar la solicitud HTTP
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACK_END}/url/pdf`, options);

        // Verificar si la respuesta es correcta
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

         // Obtiene la respuesta en formato blob
         const blob = await response.blob();
         const url = URL.createObjectURL(blob);
 
         // retorna la URL del PDF
         return url;
    } catch (error) {
        throw error;
    }
}
