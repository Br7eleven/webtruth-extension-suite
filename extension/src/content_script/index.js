// Content script for WebTruth extension
const CLAIM_REGEX = /\d+(?:\.\d+)?\s*%/g;

const highlightClaim = (node) => {
  if (node.nodeType === Node.TEXT_NODE && node.textContent) {
    const matches = [...node.textContent.matchAll(CLAIM_REGEX)];
    if (matches.length > 0) {
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;

      matches.forEach(match => {
        if (match.index !== undefined) {
          // Add text before the match
          if (match.index > lastIndex) {
            fragment.appendChild(document.createTextNode(node.textContent.substring(lastIndex, match.index)));
          }

          // Create highlight span
          const span = document.createElement('span');
          span.className = 'webtruth-highlight';
          span.textContent = match[0];
          span.onclick = (e) => {
            e.stopPropagation();
            console.log('Claim clicked:', match[0]);
            // Send message to background script
            chrome.runtime.sendMessage({
              type: 'CLAIM_CLICKED',
              text: match[0],
              context: node.textContent
            });
          };
          fragment.appendChild(span);
          lastIndex = match.index + match[0].length;
        }
      });

      // Add any remaining text after the last match
      if (lastIndex < node.textContent.length) {
        fragment.appendChild(document.createTextNode(node.textContent.substring(lastIndex)));
      }

      node.parentNode?.replaceChild(fragment, node);
    }
  }
};

const walkDOM = (node) => {
  if (node.nodeType === Node.ELEMENT_NODE && ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME'].includes(node.nodeName)) {
    return; // Skip these elements
  }

  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    highlightClaim(child);
    walkDOM(child);
  }
};

// Inject CSS for highlighting
const injectCSS = () => {
  const style = document.createElement('style');
  style.textContent = `
    .webtruth-highlight {
      background-color: transparent;
      box-shadow: inset 0 -2px 0 yellow;
      transition: background-color 0.3s ease;
      cursor: pointer;
    }
    .webtruth-highlight:hover {
      background-color: rgba(255, 255, 0, 0.3);
    }
  `;
  document.head.appendChild(style);
};

// Initialize content script
injectCSS();
walkDOM(document.body);

console.log("WebTruth content script loaded and scanning for claims.");

