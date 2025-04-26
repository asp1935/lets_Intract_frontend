import axios from 'axios'

export const handler = async (event) => {
    if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    try {
        // Extract query parameters
        const queryStringParameters = event.queryStringParameters;

        // Forward the query params to the real API
        const response = await axios({
            method: 'POST', // Always POST
            url: 'http://115.124.105.220/API/GetTalukasOfDistrict',
            params: queryStringParameters,  // This is important: pass query params
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Proxy Error", error: error.message }),
        };
    }
};
