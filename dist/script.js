// Function to create an iframe with a given source URL
function loadIframe(src) {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = '1px solid #ccc';
    const container = document.getElementById('iframeContainer');
    container.innerHTML = ''; // Clear previous content
    container.appendChild(iframe);
  }
  
  document.getElementById('loadBasic').addEventListener('click', () => {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) return alert('Please enter a URL');
    // Encode the URL for safe transport
    const proxyUrl = `/proxy?url=${encodeURIComponent(url)}`;
    loadIframe(proxyUrl);
  });
  
  document.getElementById('loadPuppeteer').addEventListener('click', () => {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) return alert('Please enter a URL');
    const proxyUrl = `/proxy-puppeteer?url=${encodeURIComponent(url)}`;
    loadIframe(proxyUrl);
  });
  