/* function getPreview(text, wordLimit) {
    const words = text.trim().split(/\s+/); // Split text by spaces
    return words.slice(0, wordLimit).join(" ") + "..."; // Join first 15 words + ellipsis
} 

function getPreview(text, wordLimit) {
    const words = [...text.trim()]; // Spread operator to handle both words & characters

    return words.slice(0, wordLimit).join("") + "..."; // Keep correct spacing for English, no extra gaps for Chinese
}*/

function getPreview(text, wordLimit) {
    //const isChinese = /[\u4e00-\u9fff]/.test(text); // Checks if text contains Chinese characters
    const isAsianScript = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(text);
    
    //if (isChinese) {
    if (isAsianScript) {
        return text.slice(0, wordLimit * 4) + "..."; // Slice by characters
    } else {
        const words = text.trim().split(/\s+/); // Split English text by spaces
        return words.slice(0, wordLimit).join(" ") + "..."; // Slice by words
    }
}

    

module.exports = getPreview;

// Example usage:
// const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
// const preview = getPreview(text, 15);
// console.log(preview); // Output: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore..."
