const buildResponse = (h, status, message, code, data = null) => {
    const response = {
      status,
      message,
    };
  
    // Menambahkan `data` hanya jika tersedia
    if (data !== null) {
      response.data = data;
    }
  
    return h.response(response).code(code);
  };

  export default buildResponse;
  