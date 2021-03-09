const container = document.querySelector(".container")
const pulseWave = document.querySelector("#pulse")
const glowingOrb = document.querySelector("#orb")

document.body.prepend(particles.canvas)

pulseWave.addEventListener("animationend",   () => pulseWave.remove())
glowingOrb.addEventListener("animationend",  () => particles.bigBang(), () => glowingOrb.remove())

coresAwaitingDOM.forEach(core => {
    container.appendChild(core)
})