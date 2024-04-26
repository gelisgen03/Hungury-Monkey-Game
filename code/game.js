const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let score = 0;
let playerName=""
let ball = { 
    x: canvas.width / 3,
    y: canvas.height - 300, 
    radius: 20, 
    speed: 3 
};
let ringInterval = 3000; // Initial interval between ring generation in milliseconds
let ringTimer; // Timer for generating rings
let gameTime = 60; // Initial game time in seconds
let timerInterval; // Timer for the game timer

let rings = [];
let xVelocity = 0; // Initial velocity along the x-axis
const maxVelocity = 5; // Maximum velocity
const bottomBoundary = canvas.height - ball.radius; // Define bottom boundary

//Top çizme (hareket) fonksiyonu
function drawBall() {
    let ballImage = new Image();
    ballImage.src = 'sempanze.jpg';
    ctx.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, ball.radius *3, ball.radius * 3);
}

//Ring üzerine koyulan muzları çizme fonksiyonu
function drawRings() {
    for (let i = 0; i < rings.length; i++) {
        let ring = rings[i];
        let image = new Image();
        image.src = 'muz.jpeg';
        ctx.drawImage(image, ring.x - ring.radius, ring.y - ring.radius, ring.radius * 2, ring.radius * 2);
    }
}
//Muz çizmeyi bşlatma fonksiyonu
function startRingGeneration() {
    generateRing();
    ringTimer = setInterval(generateRing, ringInterval);
}

//Muz çizme fonksiyonu
function generateRing() {
    const ringRadius = 20;
    const ringY = Math.random() * (canvas.height - 2 * ringRadius) + ringRadius;
    const startX = canvas.width + ringRadius;
    rings.push({ x: startX, y: ringY, radius: ringRadius });
}

//muzların pozisyonunu günceller
function updateRingPosition() {
    for (let i = 0; i < rings.length; i++) {
        rings[i].x -= 2;
        if (rings[i].x + rings[i].radius < 0) {
            rings.splice(i, 1);
            i--;
        }
    }
}
//genel update fonksiyonu
function update() {
    for (let i = 0; i < rings.length; i++) {
        let dx = ball.x - rings[i].x;
        let dy = ball.y - rings[i].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ball.radius + rings[i].radius) {
            score++;
            rings.splice(i, 1);
            document.getElementById("currentHtmlScore").innerHTML = score;
        }
    }
}

//maymunun pozisyonu günceller
function updateBallPosition() {
    ball.y += ball.speed;
    ball.x += xVelocity;

    if (ball.x < ball.radius) {
        ball.x = ball.radius;
    } else if (ball.x > canvas.width - ball.radius) {
        ball.x = canvas.width - ball.radius;
    }

    if (ball.y > bottomBoundary) {
        gameOver();
    }
}
//Sağ yön tusu kontrolü
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        xVelocity = -2;
    } else if (event.key === 'ArrowRight') {
        xVelocity = 2;
    }
});
//Sol klavye tuşu kontrolü
document.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        xVelocity = 0;
    }
});
//Mouse click kontrolü
canvas.addEventListener('click', function(event) {
    ball.y -= 50;
});

//Üst yön tuş kontolü 
document.addEventListener('keydown', function(event) {
    if (event.keyCode == 38) {
        ball.y -= 50;
    }
});

//oyun sonlandırma fonksiyonu
function gameOver() {
    clearInterval(timerInterval); // Oyun zamanlayıcısını durdur

    // Topun başlangıç konumunu ayarla
    ball.x = canvas.width / 3;
    ball.y = canvas.height - 300;

    // Kullanıcıya oyunu baştan başlatma seçeneği sun
    let chose = confirm("OYUN BİTTİ "+ playerName +" !"+ "\nSKOR: " + score +
        "\nLütfen Yeniden Mod Seçimi Yapınız");

   
    if (chose) {
        window.location.reload(true); 
    }else{
        window.location.reload(true);
    }

    document.getElementById("currentHtmlScore").innerHTML = score;
}

//zamanlayıcıyı başlatma
function startTimeGame() {
    const modName="Against Time";

    function startGameTimer() {
        timerInterval = setInterval(function() {
            gameTime--;
            if (gameTime <= 0) {
                clearInterval(timerInterval);
                gameOver();
            }
            document.getElementById("gameTimer").innerHTML = "00:"+gameTime;
        }, 1000);
    }

    document.getElementById("mod").innerHTML = modName;
    const mode = confirm("Zamana Karşı Mod'u seçtiniz. Devam etmek istiyor musunuz?");
    if (mode) {
        playerName = prompt("Lütfen adınızı girin:");
        if (playerName) {
            gameLoop();
            startRingGeneration();
            startGameTimer();
            alert("Oyun başlıyor! İyi eğlenceler, " + playerName + "!");
            document.getElementById("playerName").innerHTML = playerName;

        } 
        else {
            alert("Geçerli bir isim girmediğiniz için oyun başlatılamadı.");
            gameOver()
        }
    } else {
        alert("Zamana Karşı Mod'u seçmediğiniz için oyun başlatılamadı.");
    }
}

//Normal game seçildiğinde çağırılan fonksiyon
function startNormalGame() {

    const modName="Normal";

    function startNormalGameTimer() {
        gameTimeNormal = 0; // Oyun süresini sıfırla
        updateNormalGameTimerDisplay(); // HTML'de gösterimi güncelle
        timerInterval = setInterval(function() {
            gameTimeNormal++; // Zamanı artır
            updateNormalGameTimerDisplay(); // HTML'de gösterimi güncelle
        }, 1000);
    }
    
    // Normal mod için kronometre gösterimini güncelleme fonksiyonu
    function updateNormalGameTimerDisplay() {
        const minutes = Math.floor(gameTimeNormal / 60);
        const seconds = gameTimeNormal % 60;
        document.getElementById("gameTimer").innerHTML = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    
    document.getElementById("mod").innerHTML = modName;
    const mode = confirm("Normal Mod'u seçtiniz. Devam etmek istiyor musunuz?");
    if (mode) {
        playerName = prompt("Lütfen adınızı girin:");
        if (playerName) {
            gameLoop();
            startRingGeneration();
            startNormalGameTimer();
            updateNormalGameTimerDisplay()
            alert("Oyun başlıyor! İyi eğlenceler, " + playerName + "!");
            document.getElementById("playerName").innerHTML = playerName;
        } 
        else {
            alert("Geçerli bir isim girmediğiniz için oyun başlatılamadı.");
            gameOver()
        }
    } else {
        alert("Normal Mod'u seçmediğiniz için oyun başlatılamadı.");
    }
}

//Genel oyun döngüsü
function gameLoop() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawRings();
    updateBallPosition();
    updateRingPosition();
    update();
    requestAnimationFrame(gameLoop);
    
    
}



