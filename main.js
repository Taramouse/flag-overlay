
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const main = $('main')
const output = $('.output')
const credit = $('.credit')

const getRandomImage = images => images[Math.floor(Math.random() * images.length)]

const flags = opacity => ({
  france: `
    linear-gradient(to right,
      hsla(226, 100%, 29%, ${opacity}) 33%,
      hsla(0, 0%, 100%, ${opacity}) 33%,
      hsla(0, 0%, 100%, ${opacity}) 66%,
      hsla(355, 84%, 55%, ${opacity}) 66%
    )
  `,
  italy: `
    linear-gradient(to right,
      rgba(18, 143, 68, ${opacity}) 33%,
      hsla(0, 0%, 100%, ${opacity}) 33%,
      hsla(0, 0%, 100%, ${opacity}) 66%,
      hsla(355, 84%, 55%, ${opacity}) 66%
    )
  `,
  germany: `
    linear-gradient(to bottom,
      rgba(0, 0, 0, ${opacity}) 33%,
      rgba(218, 16, 23, ${opacity}) 33%,
      rgba(218, 16, 23, ${opacity}) 66%,
      rgba(251, 201, 10, ${opacity}) 66%
    )
  `,
  uk: `
    url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' opacity='${opacity}' viewBox='0 0 60 30'%3E%3CclipPath id='t'%3E%3Cpath d='M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z'/%3E%3C/clipPath%3E%3Cpath d='M0,0 v30 h60 v-30 z' fill='%2300247d'/%3E%3Cpath d='M0,0 L60,30 M60,0 L0,30' stroke='%23fff' stroke-width='6'/%3E%3Cpath d='M0,0 L60,30 M60,0 L0,30' clip-path='url%28%23t%29' stroke='%23cf142b' stroke-width='4'/%3E%3Cpath d='M30,0 v30 M0,15 h60' stroke='%23fff' stroke-width='10'/%3E%3Cpath d='M30,0 v30 M0,15 h60' stroke='%23cf142b' stroke-width='6'/%3E%3C/svg%3E%0A") no-repeat center / cover
  `,
  sweden: `
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' opacity='${opacity}' viewBox='0 0 16 10'%3E%3Crect width='16' height='10' fill='%23006aa7'/%3E%3Crect width='2' height='10' x='5' fill='%23fecc00'/%3E%3Crect width='16' height='2' y='4' fill='%23fecc00'/%3E%3C/svg%3E") no-repeat center / cover
  `,
  iceland: `
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' opacity='${opacity}' viewBox='0 0 500 360'%3E%3Cpath d='M0,0H500V360H0' fill='%23003897'/%3E%3Cpath d='M140,0h80V360h-80M0,140H500v80H0' fill='%23FFFFFF'/%3E%3Cpath d='M160,0h40V360h-40M0,160H500v40H0' fill='%23d72828'/%3E%3C/svg%3E") no-repeat center / cover
  `
})

const current = {}
const currentImage = () => `${current.image.urls.regular.replace(/&w=\d+|&fit=\w+/g, '')}&w=1280&h=720&fit=crop&auto=format${current.greyscale ? '&sat=-100' : ''}`
const draw = () => {
  const { opacity, country, image, blendMode } = current
  if (!image) return
  output.style.background = `
    ${flags(opacity)[country]},
    url(${currentImage()}) no-repeat center / cover
  `
  output.style.backgroundBlendMode = blendMode
  credit.innerHTML = `
    Photo by
    <a href="${image.user.portfolio_url}" target="_blank">${image.user.name}</a>.
    Sourced from <a href="${image.links.html}" target="_blank">Unsplash</a>.`
}

/* For keyboard accessibility */
document.addEventListener('keyup', e => {
  console.log(e)
  if (e.target.tagName === "LABEL" && (e.keyCode === 32 || e.keyCode === 13)) {
    e.target.click()
    e.preventDefault()
  }
})

/* Country selector */
const changeCountry = country => {
  current.country = country
  fetch(`https://frontend.center/ep13/${country}.json`)
    .then(response => response.json())
    .then(json => {
      if (current.country === country) {
        current.image = getRandomImage(json)
        draw()
      }
    })
}

changeCountry($('main input[name="image"][checked]').value)

$$('main input[name="image"]').forEach(input => {
  input.addEventListener('change', () => changeCountry(input.value))
  input.addEventListener('click',
    () => current.country === input.value && changeCountry(input.value))
})

/* Opacity selector */
const changeOpacity = opacity => {
  current.opacity = opacity
  draw()
}

changeOpacity($('main input[name="opacity"][checked]').value)

$$('main input[name="opacity"]').forEach(input => {
  input.addEventListener('change', e => changeOpacity(input.value))
})

/* Opacity selector */
const changeGreyscale = greyscale => {
  current.greyscale = (greyscale === "true")
  draw()
}

changeGreyscale($('main input[name="greyscale"][checked]').value)

$$('main input[name="greyscale"]').forEach(input => {
  input.addEventListener('change', e => changeGreyscale(input.value))
})

/* Blend mode selector */
const changeBlendMode = blendMode => {
  current.blendMode = blendMode
  draw()
}

changeBlendMode($('main input[name="blend-mode"][checked]').value)

$$('main input[name="blend-mode"]').forEach(input => {
  input.addEventListener('change', e => changeBlendMode(input.value))
})
