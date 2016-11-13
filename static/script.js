/* eslint-disable */
(function () {
  const mock = JSON.stringify({
    blocks: [
      {
        text: 'This is a Title',
        type: 'header-one',
      },
      {
        text: 'Here\'s some text, it\'s useful More text, some inline styling for some element',
        inlineStyleRanges: [
          {
            offset: 53,
            length: 7,
            style: 'BOLD'
          },
          {
            offset: 65,
            length: 4,
            style: 'ITALIC'
          }
        ]
      }
    ]
  }, null, 2)

  const toHtml = () => {
    fetch('/tohtml', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: window.json.value
    })
      .then(res => res.text()
        .then(r => {
          window.html.value = r
        })
      )
  }

  const toJson = () => {
    fetch('/tojson', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: window.html.value
    })
      .then(res => res.json()
        .then(r => {
          window.json.value = JSON.stringify(r, null, 2)
        })
      )
  }

  window.json.value = mock
  toHtml()

  window.tojson.addEventListener('click', toJson)
  window.tohtml.addEventListener('click', toHtml)
})()
