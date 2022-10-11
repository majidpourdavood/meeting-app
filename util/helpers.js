const User = require('../models/user');

function sendJson(status, errors, message, action, data) {
    let response = {
        "status": status,
        "errors": errors,
        "message": message,
        "action": action,
        "data": data
    };
    return response;
}

const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};



exports.imageFilter = imageFilter;

exports.sendJson = sendJson;
