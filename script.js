/* =================================
   DAWIDDOTSOL NETWORK
   Animated Node Graph
================================= */

const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");

let nodes = [];
let mouse = {
    x: null,
    y: null,
    radius: 150
};


/* =================================
   CANVAS SETUP
================================= */

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    createNodes();
}

window.addEventListener("resize", resizeCanvas);


/* =================================
   CREATE NETWORK NODES
================================= */

function createNodes() {

    nodes = [];

    const numberOfNodes =
        Math.min(
            80,
            Math.floor(
                (window.innerWidth * window.innerHeight) / 14000
            )
        );

    for (let i = 0; i < numberOfNodes; i++) {

        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,

            size: Math.random() * 1.8 + 0.7,

            speedX:
                (Math.random() - 0.5) * 0.35,

            speedY:
                (Math.random() - 0.5) * 0.35
        });
    }
}


/* =================================
   MOUSE TRACKING
================================= */

window.addEventListener("mousemove", (event) => {

    mouse.x = event.clientX;
    mouse.y = event.clientY;

});


window.addEventListener("mouseleave", () => {

    mouse.x = null;
    mouse.y = null;

});


/* =================================
   DRAW NODE
================================= */

function drawNode(node) {

    ctx.beginPath();

    ctx.arc(
        node.x,
        node.y,
        node.size,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "rgba(0, 245, 212, 0.8)";

    ctx.fill();
}


/* =================================
   DRAW CONNECTION
================================= */

function drawConnection(nodeA, nodeB, distance) {

    const maxDistance = 150;

    if (distance > maxDistance) {
        return;
    }

    const opacity =
        1 - distance / maxDistance;

    ctx.beginPath();

    ctx.moveTo(nodeA.x, nodeA.y);

    ctx.lineTo(nodeB.x, nodeB.y);

    ctx.strokeStyle =
        `rgba(0, 245, 212, ${opacity * 0.16})`;

    ctx.lineWidth = 0.6;

    ctx.stroke();
}


/* =================================
   UPDATE NODE
================================= */

function updateNode(node) {

    node.x += node.speedX;
    node.y += node.speedY;


    /* Bounce from edges */

    if (
        node.x <= 0 ||
        node.x >= canvas.width
    ) {
        node.speedX *= -1;
    }


    if (
        node.y <= 0 ||
        node.y >= canvas.height
    ) {
        node.speedY *= -1;
    }


    /* Mouse interaction */

    if (
        mouse.x !== null &&
        mouse.y !== null
    ) {

        const dx =
            mouse.x - node.x;

        const dy =
            mouse.y - node.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distance < mouse.radius) {

            const force =
                (mouse.radius - distance)
                / mouse.radius;

            node.x -=
                (dx / distance) *
                force *
                0.5;

            node.y -=
                (dy / distance) *
                force *
                0.5;
        }
    }
}


/* =================================
   ANIMATION LOOP
================================= */

function animate() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* Update nodes */

    nodes.forEach(updateNode);


    /* Draw connections */

    for (let i = 0; i < nodes.length; i++) {

        for (
            let j = i + 1;
            j < nodes.length;
            j++
        ) {

            const dx =
                nodes[i].x -
                nodes[j].x;

            const dy =
                nodes[i].y -
                nodes[j].y;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            drawConnection(
                nodes[i],
                nodes[j],
                distance
            );
        }
    }


    /* Draw nodes */

    nodes.forEach(drawNode);


    requestAnimationFrame(animate);
}


/* =================================
   START
================================= */

resizeCanvas();
animate();


const shareButton = document.getElementById("shareButton");

shareButton.addEventListener("click", () => {
    navigator.clipboard.writeText(window.location.href);

    const originalText = shareButton.innerHTML;

    shareButton.innerHTML =
        '<i class="fa-solid fa-check"></i> Link Copied!';

    setTimeout(() => {
        shareButton.innerHTML = originalText;
    }, 2000);
});