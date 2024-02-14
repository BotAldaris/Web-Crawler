const jsdom = require("jsdom");
const { JSDOM } = jsdom;
/**
 * 
 * @param {string} url 
 */
function normalizeURL(url){
    const urlObj = new URL(url)
    const fullPath = `${urlObj.host}${urlObj.pathname}`
    if(fullPath.endsWith("/")){
        return fullPath.slice(0,-1)
    }
    return fullPath
}
/**
 * 
 * @param {string} htmlBody 
 * @param {string} baseURL 
 */
function getURLsFromHTML(htmlBody, baseURL){
    const body = new JSDOM(htmlBody)
    const atags = body.window.document.querySelectorAll("a")
    const result = []
    for (const a of atags) {
        try {
            if (a.href.startsWith("/")){
            result.push(baseURL+a.href)
        }else{
            result.push(new URL(a.href).href)
        }
        } catch (error) {
            continue;
        }
    }
    return result
}


module.exports = {
    normalizeURL,
    getURLsFromHTML
}