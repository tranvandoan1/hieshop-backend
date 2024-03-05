const LZString = require('lz-string');
export const dataEn=(mess,status,data)=>{
    var encodedString = LZString.compressToBase64(JSON.stringify(data)+process.env.JWT_SECRET);
    return {
        message: mess,
        status: status,
        data: encodedString,
    };
}