let container = document.querySelector(".container")
let pulseWave = document.querySelector("#pulse")
let glowingOrb = document.querySelector("#orb")

const deletePulsewave = () => {
    pulseWave.removeEventListener("animationend", deletePulsewave)
    pulseWave.remove()
    pulseWave = null
}

const fireBigBang = () => {
    particles.bigBang() 
    particles = null
    glowingOrb.removeEventListener("animationend", fireBigBang)
    glowingOrb.remove()
    glowingOrb = null
}

document.body.prepend(particles.canvas)
pulseWave.addEventListener("animationend", deletePulsewave)
glowingOrb.addEventListener("animationend", fireBigBang)
coresAwaitingDOM.forEach(core => container.appendChild(core))
coresAwaitingDOM = null
container = null