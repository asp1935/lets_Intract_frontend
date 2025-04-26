export const handler = async (event, context) => {
    if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: 'Method Not Allowed',
      };
    }
  
    try {
      const query = event.queryStringParameters;
  
      // Build query string manually
      const queryString = new URLSearchParams(query).toString();
  
      const response = await fetch(`http://115.124.105.220/API/GetTalukasOfDistrict?${queryString}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      const data = await response.json();
  
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
  
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Proxy Error", error: error.message }),
      };
    }
  };
  