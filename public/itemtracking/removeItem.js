
class waisted {
    constructor(canvas, ate, size = 100) {
        this.canvas = canvas;
        this.ateButton = ate;
        this.canvas.width = size * 2.5;
        this.canvas.height = size * 2.5;
        this.canvas.style.border = "1px solid green";
        this.ctx = this.canvas.getContext("2d");
        this.fill = 0;
        this.x = 0;
        this.y = 0;
        this.eaten = 0;
        this.size = size;
        this.addEvents()
    }
    draw() {
        let captured = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "green"
        //first part
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2, this.size, Math.PI * 1.5, Math.PI, true);
        this.ctx.lineTo(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2);
        this.ctx.lineTo(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2 - this.size);
        this.ctx.stroke();
        if (this.fill >= 1) {
            this.ctx.fill()
        }
        this.ctx.closePath();
        if (this.ctx.isPointInPath(this.x, this.y)) {
            this.fill = 1;
            captured = true;
        }
        //second part
        this.ctx.beginPath();

        this.ctx.arc(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2, this.size, Math.PI / 2, Math.PI);
        this.ctx.lineTo(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2);
        this.ctx.lineTo(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2 + this.size);
        this.ctx.stroke();
        if (this.fill >= 2) {
            this.ctx.fill()
        }
        this.ctx.closePath();
        if (this.ctx.isPointInPath(this.x, this.y)) {
            this.fill = 2;
            captured = true;
        }
        //third part
        this.ctx.beginPath();

        this.ctx.arc(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2, this.size, 0, Math.PI / 2);
        this.ctx.lineTo(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2);
        this.ctx.lineTo(this.canvas.clientWidth / 2 + this.size, this.canvas.clientHeight / 2)
        this.ctx.stroke();
        if (this.fill >= 3) {
            this.ctx.fill();
        }
        this.ctx.closePath();
        if (this.ctx.isPointInPath(this.x, this.y)) {
            this.fill = 3;
            captured = true;
        }
        //fourth part
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2, this.size, Math.PI * 1.5, 0);
        this.ctx.lineTo(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2);
        this.ctx.lineTo(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2 - this.size);
        this.ctx.stroke();
        if (this.fill >= 4) {
            this.ctx.fill();
        }
        this.ctx.closePath();
        if (this.ctx.isPointInPath(this.x, this.y)) {
            this.fill = 4;
            captured = true;
        }
        if (!captured) {
            this.fill = 0;
        }
    }
    getAmout(){
        return this.eaten;
    }
    addEvents() {
        this.canvas.addEventListener("mousemove", (e) => {
            this.x = e.clientX - this.canvas.offsetLeft + window.scrollX;
            this.y = e.clientY - this.canvas.offsetTop + window.scrollY;
        })
        this.interval = setInterval(() => {
            this.draw();
        }, 30);
        this.canvas.addEventListener("click", (e) => {
            this.draw();
            this.eaten = this.fill;
            this.ateButton.textContent = `I ate ${this.fill * 25}%`;


        })
    }
}
let waist = new waisted(document.querySelector("#removeItem canvas"), document.querySelector("#ate"), 50);

document.querySelector("#ate").addEventListener('click', () => {
    let eaten = (waist.getAmout() * 25);

    let data = {
        "index": removeIndex,
        "eaten": eaten
    };
    fetch("/API/wasteditem", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    }).then(response => {
        if (response.ok) {
            window.location.reload();
        }

    })

});

document.querySelector("#clear").addEventListener('click', () => {
    window.location.reload();

})
