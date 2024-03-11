// src/utils/clipboardUtils.js
export const copyToClipboard = async (text) => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Fallback: Unable to copy', err);
      }
      document.body.removeChild(textArea);
    }
  };
  