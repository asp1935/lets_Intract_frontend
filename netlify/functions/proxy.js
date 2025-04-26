export const handler = async (event, context) => {
  try {
    const path = event.queryStringParameters?.path;
    const query = { ...event.queryStringParameters };
    delete query.path;

    const queryString = new URLSearchParams(query).toString();

    let targetUrl = '';
    let method = 'POST';

    if (path === 'districts') {
      targetUrl = `http://115.124.105.220/API/GetAllDistricts`;
    } else if (path === 'talukas') {
      targetUrl = `http://115.124.105.220/API/GetTalukasOfDistrict?${queryString}`;
    } else {
      return {
        statusCode: 400,
        body: 'Invalid path',
      };
    }

    const response = await fetch(targetUrl, {
      method,
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
