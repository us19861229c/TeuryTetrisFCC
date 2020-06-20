document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const width = 10
  let proximaRandomica = 0

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

  const pecasTetris = [pEmL, pEmZ, pEmT, pEmO, pEmI]

  let posAtual = 4
  let rotacaoAtual = 0
  //escolher aleatoriamente uma peça de Tetris
  let randomico = Math.floor(Math.random()*pecasTetris.length)
  let atual = pecasTetris[randomico][rotacaoAtual]

  //desenha a peça de Tetris
  function desenhar() {
    atual.forEach(index => {
      squares[posAtual + index].classList.add('pTetris')
    })
  }

  //apaga a peça de Tetris
  function apagar() {
    atual.forEach(index => {
      squares[posAtual + index].classList.remove('pTetris')
    })
  }

  //faz a peça de Tetris mover-se para baixo a cada segundo 
  timerId = setInterval(moveParaBaixo, 1000)

  //move a peça naturalmente para baixo com o passar do tempo
  function moveParaBaixo() {
    apagar()
    posAtual += width
    desenhar()
    pecaPresa()
  }

  //função que prende a peça ao chão
  function pecaPresa(){
    if(atual.some(index => squares[posAtual + index + width].classList.contains('usada'))) {
      atual.forEach(index => squares[posAtual + index].classList.add('usada'))
      //gera uma nova peça randômica
      randomico = proximaRandomica
      proximaRandomica = Math.floor(Math.random() * pecasTetris.length)
      atual = pecasTetris[randomico][rotacaoAtual]
      posAtual = 4
      desenhar()
      exibePecaTetris()
    }
  }

  //relaciona as teclas do teclado aos movimentos da peça (esquerda, direita, para baixo mais rápido, para cima gira a peça)
  function controlaTecladoMovimento(e) {
    if(e.keyCode === 37) {
      moveParaEsquerda()
    }else if (e.keyCode === 38){
      rotacionaAPeca()
    }else if (e.keyCode === 39){
      moveParaDireita()
    }else if (e.keyCode === 40){
      moveParaBaixo()
    }
  }
  document.addEventListener('keyup', controlaTecladoMovimento)

  //rotaciona a peça de Tetris
  function rotacionaAPeca() {
    apagar()
    rotacaoAtual++
    if(rotacaoAtual === atual.length) { //se a rotação atingir o n 4 , faz ela zerar e recomeçar
      rotacaoAtual = 0
    }
    atual = pecasTetris[randomico][rotacaoAtual]
    desenhar()
  }

  //move a peça de Tetris para a esquerda até encontrar os limites da fase. 
  function moveParaEsquerda() {
    apagar()
    const estaNaBordaEsquerda = atual.some(index => (posAtual + index) % width === 0)

    if(!estaNaBordaEsquerda) posAtual -=1

    if(atual.some(index => squares[posAtual + index].classList.contains('usada'))) {
      posAtual +=1
    }

    desenhar()
  }
  //move a peça de Tetris para a direita até encontrar os limites da fase. 
  function moveParaDireita() {
    apagar()
    const estaNaBordaDireita = atual.some( index => (posAtual + index) % width === width -1)

    if(!estaNaBordaDireita) posAtual +=1

    if(atual.some(index => squares[posAtual + index].classList.contains('usada'))) {
      posAtual -=1
    }

    desenhar()
  }
// FIXME : Lembrar que existe um erro esquisito quando as peças de tetris rotacionam perto das bordas (esquerda ou direita) - esse erro se revelou desde o último commit 

  //mostra a próxima peça de Tetris no mini-grid (janelinha)
  const janelinhaQuadrados = document.querySelectorAll('.mini-grid div')
  const janelinhaLargura = 4
  let janelinhaIndice = 0

  //as peças de Tetris sem rotação (apenas para serem exibidas na janelinha lateral)
  const proximasPecas = [
    [1, janelinhaLargura+1, janelinhaLargura*2+1, 2], //Peça em L
    [0, janelinhaLargura, janelinhaLargura+1, janelinhaLargura*2+1], //Peça em Z
    [1, janelinhaLargura, janelinhaLargura+1, janelinhaLargura+2], //Peça em T
    [0, 1, janelinhaLargura, janelinhaLargura+1], //Peça em O
    [1, janelinhaLargura+1, janelinhaLargura*2+1, janelinhaLargura*3+1] //Peça em I
  ]

  //exibe a próxima peça na janelinha
  function exibePecaTetris() {
    //remove qualquer rastro da peça de Tetris da grid
    janelinhaQuadrados.forEach(squares => {
      squares.classList.remove('pTetris')
    })
    proximasPecas[proximaRandomica].forEach( index => {
      janelinhaQuadrados[janelinhaIndice + index].classList.add('pTetris')
    })
  }
//FIXME: a segunda peça não é revelada na grid, só a partir da terceira. Importante começar o jogo com a sgeunda peça sendo exibida. Outro ponto é centralizar melhor as peças no mini-grid
})