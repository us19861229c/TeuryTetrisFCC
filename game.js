document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const width = 10

  const scoreDisplay = document.querySelectorAll('#score')
  const startButton = document.querySelector('#start-button')

// as peças de Tetris
  //Peça em L
  const pEmL = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]
  //Peça em Z
  const pEmZ = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]
  //Peça em T
  const pEmT = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]
  //Peça em O
  const pEmO = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]
  //Peça em I
  const pEmI = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const pecasTetris = [pEmL, pEmZ, pEmO, pEmT, pEmI]

  let posAtual = 4
  let rotaAtual = 0
  //escolher aleatoriamente uma peça de Tetris
  let randomico = Math.floor(Math.random()*pecasTetris.length)
  let atual = pecasTetris[randomico][rotaAtual]

  //desenha a peça de Tetris
  function desenhar() {
    atual.forEach(index => {
      squares[posAtual + index].classList.add('pTetris')
    })
  }  

  //apagar a peça de Tetris
  function apagar() {
    atual.forEach(index => {
      squares[posAtual + index].classList.remove('pTetris')
    })
  }

})