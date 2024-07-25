
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const $score = document.querySelector('span') 
const $section = document.querySelector('section')
const BLOCK_SIZE = 20
const BLOCK_WIDTH = 14
const BLOCK_HEIGHT = 25
const EVEN_MOVEMENTS = {
    LEFT : 'ArrowLeft',
    RIGHT : 'ArrowRight',
    DOWN : 'ArrowDown'
}
let score = 0
canvas.width=BLOCK_SIZE*BLOCK_WIDTH
canvas.height= BLOCK_SIZE*BLOCK_HEIGHT
context.scale(BLOCK_SIZE,BLOCK_SIZE)
// board:
const board = createBoard(BLOCK_WIDTH, BLOCK_HEIGHT)
function createBoard(width, height){
    return Array(height).fill().map(() => Array(width).fill(0))
}


//  piece
const piece = {
    position: {x: 5, y:0},
    shape : [
       [1,1],
       [1,1]
    ]
}

// random pieces 
const PIECES = [
    [
        [1,1],
        [1,1]
    ]
    ,[
        [1,1,1,1]
    ],
    [
        [1],
        [1],
        [1],
        [1]
    ]
    ,[
        [1,1,0],
        [0,1,1]
    ]
    ,[
        [0,1,0],
        [1,1,1]
    ],
    [
        [1,0],
        [1,0],
        [1,1]
    ],
    [
        [0,0,1],
        [1,1,1]
    ]
]
function draw(){
    context.fillStyle = '#000' 
    context.fillRect(0,0,canvas.width,canvas.height)
    board.forEach((row,y) => {
        row.forEach((value,x) => {
            if (value == 1) {
                context.fillStyle = 'blue'
                context.fillRect(x,y,1,1)
            }
        })
    })
    piece.shape.forEach((row,y) =>{
        row.forEach((value,x) => {
            if (value == 1) {
                context.fillStyle = 'red'
                context.fillRect(x + piece.position.x, y + piece.position.y, 1,1)
                
            }
        })
    })
    $score.innerHTML= score;
}
let dropCounter = 0
let lasTime = 0
function update(time = 0){
    const deltaTime = time - lasTime
    lasTime = time
    dropCounter += deltaTime
    if (dropCounter > 700) {
        piece.position.y++
        dropCounter = 0

        if (checkCollision()){
            piece.position.y--
            solidificar()
            removeRows()
        }
    }
    draw()
    window.requestAnimationFrame(update)
}

document.addEventListener('keydown', event =>{
    switch (event.key){
        case EVEN_MOVEMENTS.LEFT:
            piece.position.x--
            if (checkCollision()){
                piece.position.x++
            }
            break
        case EVEN_MOVEMENTS.RIGHT:
            piece.position.x++
            if (checkCollision()){
                piece.position.x--
            }
            break
        case EVEN_MOVEMENTS.DOWN:
            piece.position.y++
            if (checkCollision()){
                piece.position.y--
                solidificar()
                removeRows()
            }
            else {
                score += 1
            }
            break 
        case 'ArrowUp':
            const pieza = []
            for (let i = 0; i < piece.shape[0].length; i++){
                const row =[]
                for (let j = piece.shape.length -1 ; j >=0;j--){
                    row.push(piece.shape[j][i])
                }
                pieza.push(row)
            }
            const previousShape = piece.shape
            piece.shape = pieza
            if (checkCollision()){
                piece.shape = previousShape
            }
    }
})
function checkCollision (){
    return  piece.shape.find((row, y) =>{
        return row.find((value,x)=>{
            return value != 0 && 
            board[y+piece.position.y]?.[x+piece.position.x] != 0
        })

    })
}

function solidificar(){
    piece.shape.forEach((row,y) =>{
        row.forEach((value,x) =>{
            if (value == 1){
                board[y+piece.position.y][x+piece.position.x]=1
            }
        })
    })    
    piece.shape = PIECES[Math.floor(Math.random()*PIECES.length)]
    piece.position.x=5
    piece.position.y=0
    if (checkCollision()){
        alert('GAME OVER, Tu puntuación es : '+score)
        // limpiar el borde
        board.forEach((row) => row.fill(0))
        // parar la música
        music.pause()
    }
}

function removeRows(){
    const rowsToRemove = []
    board.forEach((row,y) =>{
        if (row.every(value => value == 1)){
            rowsToRemove.push(y)
        }
    })
    rowsToRemove.forEach((rowIndex) =>{
        board.splice(rowIndex,1) // Elimina la fila completa en el índice rowIndex
        const newRow = Array(BLOCK_WIDTH).fill(0)
        board.unshift(newRow) // Inserta la nueva fila vacía al principio del tablero
        score += 100
    })

}
$section.addEventListener('click',() =>{
    update()
    $section.remove()
    const audio = new window.Audio('./Tetris.mp3')
    audio.volume = 0.5
    audio.play()
})