let rolled = 0;
let player = 0;
let showed = false;
let maxScore;
const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const playingColor = getComputedStyle(player2).backgroundColor;
const waitingColor = getComputedStyle(player1).backgroundColor;
const rollButt = document.getElementById("RollButt");
const TextMax = document.getElementById("TextMax");
const holdButt = document.getElementById("hold");
const currentScore = document.getElementsByClassName("currentScore");
const plusEl = document.getElementsByClassName("plus");
const totalScore = document.getElementsByClassName("total");
let afterRoll = [];
let scoreNum = 0;
window.addEventListener("mousedown", (e) => e.preventDefault());
function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}
function radians_to_degrees(radians) {
  var pi = Math.PI;
  return radians * (180 / pi);
}
for (const container of document.getElementsByClassName("container")) {
  const init = () => {
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    container.appendChild(renderer.domElement);
  };

  const camera = new THREE.PerspectiveCamera(60, 1, 1, 500);
  camera.position.set(0, 0, 2);
  camera.lookAt(0, 0, 0);

  const textureLoader = new THREE.TextureLoader();
  const texture1 = textureLoader.load("./../Textures/dice-1.png");
  const texture2 = textureLoader.load("./../Textures/dice-2.png");
  const texture3 = textureLoader.load("./../Textures/dice-3.png");
  const texture4 = textureLoader.load("./../Textures/dice-4.png");
  const texture5 = textureLoader.load("./../Textures/dice-5.png");
  const texture6 = textureLoader.load("./../Textures/dice-6.png");

  const materials = [
    new THREE.MeshLambertMaterial({ map: texture1 }),
    new THREE.MeshLambertMaterial({ map: texture2 }),
    new THREE.MeshLambertMaterial({ map: texture3 }),
    new THREE.MeshLambertMaterial({ map: texture4 }),
    new THREE.MeshLambertMaterial({ map: texture5 }),
    new THREE.MeshLambertMaterial({ map: texture6 }),
  ];

  const scene = new THREE.Scene();
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(0, 0, 50);
  scene.add(light);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // const material = new THREE.MultiMaterial(materials);
  const cube = new THREE.Mesh(geometry, materials);
  // setTimeout(()=>{cube.},100,100)
  const val = new Map();

  val.set("y" + 0 + "x" + 0, 5);
  val.set("y" + 90 + "x" + 0, 2);
  val.set("y" + 180 + "x" + 0, 6);
  val.set("y" + 270 + "x" + 0, 1);
  val.set("y" + 0 + "x" + 90, 3);
  val.set("y" + 0 + "x" + 180, 6);
  val.set("y" + 0 + "x" + 270, 4);
  val.set("y" + 90 + "x" + 90, 3);

  val.set("y" + 180 + "x" + 90, 3);
  val.set("y" + 270 + "x" + 90, 3);
  val.set("y" + 90 + "x" + 180, 1);
  val.set("y" + 180 + "x" + 180, 5);
  val.set("y" + 270 + "x" + 180, 2);
  val.set("y" + 90 + "x" + 270, 4);
  val.set("y" + 180 + "x" + 270, 4);
  val.set("y" + 270 + "x" + 270, 4);

  scene.add(cube);
  renderer.render(scene, camera);
  const animationVal = {
    scoreSize: 0,
    cubePos: { x: container.style.left, y: container.style.top },
    cubeOpacity: container.style.opacity,
  };
  const animationValTo = {
    scoreSize: 0,
    cubePos: { x: 0, y: 0 },
    cubeOpacity: 0,
  };
  function render() {
    requestAnimationFrame(render);
    TWEEN.update();
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    renderer.setSize(w, h);
    container.style.opacity = animationValTo.cubeOpacity;
    renderer.render(scene, camera);
  }
  let isRolling = false;
  const showDice = () => {
    showed = true;
    const myTween = new TWEEN.Tween(animationValTo)
      .to({
        cubeOpacity: animationVal.cubeOpacity,
      })
      .easing(TWEEN.Easing.Quadratic.Out);
    myTween.start();
  };
  const hideDice = () => {
    showed = false;
    const myTween = new TWEEN.Tween(animationValTo)
      .to({
        cubeOpacity: 0,
      })
      .easing(TWEEN.Easing.Quadratic.Out);
    myTween.start();
  };
  const rollDice = (x, y, z) => {
    if (isRolling || !showed) return;
    isRolling = true;
    x = x / 100;
    y = y / 100;
    let closestY =
      (radians_to_degrees(y) / 90) % 1 >= 0.5
        ? (parseInt(radians_to_degrees(y) / 90) + 1) * 90
        : parseInt(radians_to_degrees(y) / 90) * 90;
    let closestX =
      (radians_to_degrees(x) / 90) % 1 >= 0.5
        ? (parseInt(radians_to_degrees(x) / 90) + 1) * 90
        : parseInt(radians_to_degrees(x) / 90) * 90;
    const myTween = new TWEEN.Tween(cube.rotation)
      .to({
        x,
        y,
      })
      .easing(TWEEN.Easing.Quadratic.Out);
    const myTween1 = new TWEEN.Tween(cube.rotation)
      .to({
        y: degrees_to_radians(closestY),
        x: degrees_to_radians(closestX),
        z: 0,
      })
      .easing(TWEEN.Easing.Quadratic.Out);
    myTween.start();
    myTween.chain(myTween1);
    myTween1.onComplete(() => {
      if (closestY < 0) {
        closestY = closestY + 360;
      }
      if (closestX < 0) {
        closestX = closestX + 360;
      }
      if (closestX == 360) closestX = 0;
      if (closestY == 360) closestY = 0;

      // score.innerHTML = val.get(
      //   "y" + Math.abs(closestY) + "x" + Math.abs(closestX)
      // );
      scoreNum += val.get("y" + Math.abs(closestY) + "x" + Math.abs(closestX));
      const center = new TWEEN.Tween(animationVal)
        .to({ scoreSize: 100 })
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      center.onComplete(() => {
        afterRoll.push(() => {
          const a = new TWEEN.Tween(cube.rotation);
          a.to({ x: 0, y: 0 }).easing(TWEEN.Easing.Quadratic.Out).start();
          a.onComplete(() => {
            isRolling = false;
            hideDice();
            currentScore.item(player).children.item(1).innerHTML = scoreNum;
          });
        });
        console.log("done");
        rolled++;
        if (rolled == 2) {
          rolled = 0;
          afterRoll.forEach((e) => e());
          rollButt.disabled = false;
          afterRoll = [];
        }
      });
    });
  };
  let lastPos = { x: 0, y: 0 };
  addEventListener("mouseup", (e) => {
    if (lastPos.x == 0 && lastPos.y == 0) return;
    const currentPos = {
      y: e.clientX,
      x: e.clientY,
    };
    rollDice(currentPos.x - lastPos.x, currentPos.y - lastPos.y);
    lastPos = { x: 0, y: 0 };
  });
  container.addEventListener("mousedown", (e) => {
    e.preventDefault();

    lastPos = {
      y: e.clientX,
      x: e.clientY,
    };
  });
  render();
  rollButt.addEventListener("click", (e) => {
    showDice();
    e.target.disabled = true;
  });
}

holdButt.addEventListener("click", () => {
  if (showed) return;
  // plusEl.item(player).innerHTML = "+ " + scoreNum;
  totalScore.item(player).innerHTML =
    +totalScore.item(player).textContent + scoreNum;
  if (
    +maxScore <
    (parseInt(totalScore.item(player).textContent) + scoreNum) / 2
  ) {
    alert("player " + (player ? 0 : 1) + " wins");
    totalScore.item(player).innerHTML = 0;
  } else if (
    +maxScore ==
    (parseInt(totalScore.item(player).textContent) + scoreNum) / 2
  ) {
    alert("player " + player + " wins");
    totalScore.item(player).innerHTML = 0;
  }
  scoreNum = 0;
  currentScore.item(player).children.item(1).innerHTML = 0;
  console.log(player);
  player = player ? 0 : 1;
  if (player) {
    player1.style.backgroundColor = playingColor;
    player2.style.backgroundColor = waitingColor;
  } else {
    player2.style.backgroundColor = playingColor;
    player1.style.backgroundColor = waitingColor;
  }
});
const setScore = (event) => {
  event.target.parentElement.parentElement.style.display = "none";
  console.log(TextMax.value);
  maxScore = TextMax.value;
};
const select = (e) => {
  e.target.select();
};
