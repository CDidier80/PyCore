const container = document.querySelector(".container")
const pulseWave = document.querySelector("#pulse")
const glowingOrb = document.querySelector("#orb")

const deletePulsewave = () => {
    pulseWave.removeEventListener("animationend", deletePulsewave)
    pulseWave.remove()
}

const fireBigBang = () => {
    particles.bigBang() 
    glowingOrb.removeEventListener("animationend", fireBigBang)
    glowingOrb.remove()
}

document.body.prepend(particles.canvas)
pulseWave.addEventListener("animationend", deletePulsewave)
glowingOrb.addEventListener("animationend", fireBigBang)
coresAwaitingDOM.forEach(core => container.appendChild(core))