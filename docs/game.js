document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const width = 10
  let proximaRandomica = 0
  let timerId
  let score = 0
  const cores = [
    'crimson', 'darkorchid', 'goldenrod', 'dodgerblue', 'forestgreen'
  ]

  const scoreDisplay = document.querySelector('#score')
  const startButton = document.querySelector('#start-button')

// as peças de Tetris - TODO: no Tetris64 tem ainda as peças L invertida e Z invertida. Lembrei disso jogando, então essas peças precisam ser acrescentadas depois. 
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
      squares[posAtual + index].style.backgroundColor = cores[randomico]

    })
  }

  //apaga a peça de Tetris
  function apagar() {
    atual.forEach(index => {
      squares[posAtual + index].classList.remove('pTetris')
      squares[posAtual + index].style.backgroundColor = ''
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

  //função que prende a peça ao chão ou a outras peças
  //TODO: no Tetris64 a peça pode - com a agilidade do jogador - ainda mover um pouco para direita ou esquerda ao atingir o solo (pra melhor encaixar em alguma outra peça e não deixar o buraco)
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
      adicionaScore()
      gameOver()
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
  document.addEventListener('keydown', controlaTecladoMovimento)

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
  const janelinhaIndice = 0

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
      squares.style.backgroundColor =''
    })
    proximasPecas[proximaRandomica].forEach( index => {
      janelinhaQuadrados[janelinhaIndice + index].classList.add('pTetris')
      janelinhaQuadrados[janelinhaIndice + index].style.backgroundColor = cores[proximaRandomica]
    })
  }
//FIXME: a segunda peça não é revelada na grid, só a partir da terceira. Importante começar o jogo com a sgeunda peça sendo exibida. Outro ponto é centralizar melhor as peças no mini-grid

//ativa a funcionalidade do botão Start e Pause. 
startButton.addEventListener('click', () => {
    if(timerId) {
      clearInterval(timerId)
      timerId = null
    }else {
      desenhar()
      timerId = setInterval(moveParaBaixo, 1000)
      proximaRandomica = Math.floor(Math.random() * pecasTetris.length)
      exibePecaTetris()
    }
  }) //FIXME: a peça de Tetris no preview muda toda vez que o jogo é pausado. Ela deve se manter.

  //acrescenta registro de Score e funcionalidade de quebrar linha 
  //registra score
  function adicionaScore() {
    for(let i =0; i < 199; i +=width) {
      const linha = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(linha.every(index => squares[index].classList.contains('usada'))) {
        score +=10
        scoreDisplay.innerHTML = score
        linha.forEach(index => {
          squares[index].classList.remove('usada')
          squares[index].classList.remove('pTetris')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach( cell => grid.appendChild(cell))
      }
    }
  }

  //game over!
  function gameOver() {
    if(atual.some(index => squares[posAtual + index].classList.contains('usada'))) {
      scoreDisplay.innerHTML = `Fim de jogo. Seu Score foi ${score}. Atualize para jogar novamente`
      clearInterval(timerId)
    }
  }
})
//FIXME: o Game Over ainda permite o jogador mexer as peças.
//FIXME: Algumas rotações das peças criam um 'lixo' no meio do jogo.