import React from 'react';
import ReactDOM from 'react-dom/client';

const CLAIM_REGEX = /\d+(?:\.\d+)?\s*%/g;

const highlightClaim = (node: Node) => {
  if (node.nodeType === Node.TEXT_NODE && node.textContent) {
    const matches = [...node.textContent.matchAll(CLAIM_REGEX)];
    if (matches.length > 0) {
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;

      matches.forEach(match => {
        if (match.index !== undefined) {
          // Add text before the match
          if (match.index > lastIndex) {
            fragment.appendChild(document.createTextNode(node.textContent!.substring(lastIndex, match.index)));
          }

          // Create highlight span
          const span = document.createElement('span');
          span.className = 'webttruth-highlight'; // Custom class for styling
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

const walkDOM = (node: Node) => {
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
    .webttruth-highlight {
      background-color: transparent; /* Default to transparent */
      box-shadow: inset 0 -2px 0 yellow; /* Subtle yellow underline */
      transition: background-color 0.3s ease;
      cursor: pointer;
    }
    .webttruth-highlight:hover {
      background-color: rgba(255, 255, 0, 0.3); /* Translucent yellow background on hover */
    }
  `;
  document.head.appendChild(style);
};

injectCSS();
walkDOM(document.body);

console.log("WebTruth content script loaded and scanning for claims.");


