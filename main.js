var ajaxCall = (key, url, prompt) => {
fetch(url,{
  method:"POST",
  headers:{
      'Content-Type': "application/json",
      Authorization: `Bearer ${key}`
  },
  body:JSON.stringify({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 1024,
      n: 1,
      temperature: 0.5,
    })
  }).then((res)=> {
    return res.json();
  }).catch((err)=>{
    console.log("Error in return");
  })
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
