function getPreview(text, wordLimit) {
    const words = text.trim().split(/\s+/); // Split text by spaces
    return words.slice(0, wordLimit).join(" ") + "..."; // Join first 15 words + ellipsis
}

module.exports = getPreview;

// Example usage:
// const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
// const preview = getPreview(text, 15);
// console.log(preview); // Output: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore..."
