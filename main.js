const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const ajaxCall = async (key, url, prompt) => {
  let retryCount = 0;
  const maxRetries = 5;
  const retryDelay = 1000; // You can adjust the delay time as needed
  
  while (retryCount < maxRetries) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'text-davinci-002',
          prompt: prompt,
          max_tokens: 1024,
          n: 1,
          temperature: 0.5,
        }),
      });

      if (response.status === 429) {
        // If you get a rate limit exceeded error, wait and retry
        await sleep(retryDelay);
        retryCount++;
      } else {
        return response.json();
      }
    } catch (err) {
      console.error(err);
      retryCount++;
      await sleep(retryDelay);
    }
  }

  throw new Error('Max retry count reached');
};

const url = "https://api.openai.com/v1";

(function () {
  const template = document.createElement("template");
  template.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;
  class MainWebComponent extends HTMLElement {
    async post(apiKey, endpoint, prompt) {
      const response = await ajaxCall(
        apiKey,
        `${url}/${endpoint}`,
        prompt
      );
      return response.choices[0].text;
    }
  }
  customElements.define("custom-widget", MainWebComponent);
})();
