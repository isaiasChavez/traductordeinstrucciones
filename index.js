const button = document.querySelector('#button')
const buttonCargar = document.querySelector('#cargar')
const $input = document.getElementById('input')
const container = document.querySelector('#container')
let cards = []

let texto = null
$input.addEventListener('input', e => {
  const opcode = $input.value


  const opCodeBinary = searchOpcode(opcode.toUpperCase())

  processUI( opcode )
  document.getElementById('preview').innerHTML = ''
  if( opCodeBinary )
  {
    texto= `${opCodeBinary} - ${opcode.toUpperCase()} ` 
    document.getElementById('preview').innerHTML = opCodeBinary
  }
})

const searchOpcode = (Opcode) => {
  const newOpCode = OPCODES[ Opcode ]
  if (newOpCode) {
      return newOpCode
  }
  return null
}


const processUI = texto => {
  if (!texto) {
    $input.parentElement.classList.add('empty')
  } else {
    $input.parentElement.classList.remove('empty')
  }
  if (texto.length === 0) {
    button.classList.add('opacity-50')
    button.classList.add('cursor-not-allowed')
  } else {
    button.classList.remove('opacity-50')
    button.classList.remove('cursor-not-allowed')
  }
}

button.addEventListener('click', () => {
  if (texto.length > 0) {
    saveDoc({
      id: random(),
      texto
    } )
    document.getElementById('preview').innerHTML = ''

    clearInputs()
  }
})

const saveDoc = data => {
  cards.push(data)
  localStorage.setItem('arq', JSON.stringify(cards))
  renderCards()
}

const deleteDoc = id => {
  console.log('Eliminando', { id })
  cards = cards.filter(card => card.id !== id)
  console.log({ cards })
  localStorage.setItem('arq', JSON.stringify(cards))
  renderCards()
}

const copyDoc = id => {
  const copyText = document.getElementById(id)
  copyText.select()
  copyText.setSelectionRange(0, 99999) /* For mobile devices */
  navigator.clipboard.writeText(copyText.value)

  const boton = document.getElementById(`cop${id}`)
  boton.classList.add('animate-bounce')
  setTimeout(() => {
    boton.classList.remove('animate-bounce')
  }, 500)
}

const renderCards = () => {
  container.innerHTML = ''
  if (cards.length > 0) {
    cards.map(card => {
      container.innerHTML += templateCard(card.texto, card.id)
    })
    return
  }
  container.innerHTML += templateEmpty()
}
const clearInputs = () => {
  $input.value = null
  texto = null
}

const templateCard = (message, id) => {
  return `<div class="w-full mb-3 fade-in rounded flex justify-between px-5 items-center  h-10  shadow bg-white">    
                    <input type="text" value="${message}" id="${id}" class="border-0"/>  
                    <div class="flex">
                      <button onclick="deleteDoc(${id})" class="w-10 shadow flex justify-center p-1 hover:opacity-75"><img src="./assets/delete.svg" class="w-5" alt="delete"></button>
                      <button id="cop${id}" onclick="copyDoc(${id})"  class="w-10 shadow flex justify-center p-1 hover:opacity-75"><img src="./assets/ftcopy.svg" class="w-5" alt="copy">
                      
                      </button>
                    </div>
                </div>`
}
const templateEmpty = () => {
  return `<div class="w-full h-full flex justify-center items-center"> 
                    <div class="text-lg opacity-50">
                      No tienes urls agregadas
                    </div>
                  </div>`
}
const random = () => {
  return Math.floor(Math.random() * (10000000 - 1000 + 1) + 1000)
}

function main () {
  const dataSaved = localStorage.getItem('arq')
  if (dataSaved) {
    cards = JSON.parse(dataSaved)
  } else {
    localStorage.setItem('arq', JSON.stringify(cards))
  }
  renderCards()
}

main()
