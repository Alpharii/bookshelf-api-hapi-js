export const buildResponse = (h, code, message, data = {}) => {
    return h.response({
        status: code === 200 || code === 201 ? 'success' : 'fail',
        message,
        data,
    }).code(code);
};
