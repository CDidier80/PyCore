const toPixels = (number) => `${number}px`


let coresAwaitingDOM = []

const createBlueCircle = (args) => {
    
    const {    
        rotateSpeed: seconds, 
        borderWidth: width,
        borderColor: color,
        animation,
        boxShadow,
        diameter,  
    } = args
    
    let sliver = (typeof args.sliver !== "undefined") && args.sliver
    let blueCircle = document.createElement("div")
    blueCircle.classList.add("core")
    blueCircle.style.width = blueCircle.style.height = toPixels(diameter)
    if (sliver) {
        blueCircle.classList.add(sliver)
        setTimeout( () => {
            blueCircle.classList.remove(sliver)
            blueCircle.style.animation = `${animation} ${seconds}s linear infinite`
        }, 5500);
    } else {
      blueCircle.style.animation = `${animation} ${seconds}s linear infinite`
    }
    blueCircle.style.borderWidth = toPixels(width)
    blueCircle.style.borderColor = color
  
    if (boxShadow !== ""){
        blueCircle.classList.add("box-shadow")
        blueCircle.classList.add(`${boxShadow}`)
    }
  
    return blueCircle
}


const makeSliceGradient = (tsPx, sliceColor = "rgba(0,0,0,0)", gradientStartPx, widthPx) => {
    const gradientConstant = `radial-gradient(circle, rgba(0,0,0,0) 0px, rgba(0,0,0,0) ${tsPx}, `
    const visibleGradientStart = `${sliceColor} ${gradientStartPx}, `
    const gradientEnd = `${sliceColor} ${widthPx})`
    const gradient = gradientConstant + visibleGradientStart + gradientEnd
    return gradient
}


const makeSlices = (args) => {
  
    const {       
        sliceHeight: height, 
        transparencyStop: ts,
        sliceWidth: width, 
        sliceCount, 
        sliceColor,
    } = args
    
    const tsPx = toPixels(Math.round(ts / 2))
    const gradientStartPx = toPixels(Math.round((ts / 2) + 1))
    const widthPx = toPixels(width / 2)
    
    let slices = []
    let angleIncrement = Math.round(360 / sliceCount)
    let nextAngle = -angleIncrement

    for (let i = 0; i<sliceCount; i++) {
        let slice = document.createElement("div")
        slice.classList.add("slice")
        slice.style.transform  = `rotate(${nextAngle + angleIncrement}deg)`
        slice.style.width      = toPixels(width)
        slice.style.height     = toPixels(height)
        slice.style.background = makeSliceGradient(tsPx, sliceColor, gradientStartPx, widthPx)
        slices.push(slice)
        nextAngle += angleIncrement
    }
    
    return slices
}


const createCore = (args) => {
    const core = createBlueCircle((args.forBlueCircle))
    const slices = makeSlices((args.forSlices))
    slices.forEach(slice => core.appendChild(slice))
    coresAwaitingDOM.push(core)
}


const cores = [
  
   // thin, blue, long, protruding lines
   {      
      forBlueCircle: {
          borderColor: "",
          animation: "clockwise",
          boxShadow: '',
          rotateSpeed: 230,
          borderWidth: 0,
          diameter: 0,
          sliver: "long-sliver-fast"
      },
      
      forSlices: {
          sliceColor: "rgba(69, 147, 255,.6)",
          transparencyStop: 0,
          sliceWidth: 580,
          sliceHeight: 1,
          sliceCount: 12,
      }
  },
  
   // thin, white, shorter, protruding lines
   {      
      forBlueCircle: {
          borderColor: "",
          animation: "counter-clockwise",
          boxShadow: '',
          rotateSpeed: 230,
          borderWidth: 0,
          diameter: 0,
          sliver: "short-sliver-fast"
      },
      
      forSlices: {
          sliceColor: "rgba(255,255,255,.5)",
          transparencyStop: 0,
          sliceWidth: 470,
          sliceHeight: 1,
          sliceCount: 10,
      }
  },
  
  // dark, innermost core
  {      
      forBlueCircle: {
          borderColor: "rgba(30, 132, 242,.3)",
          animation: "clockwise",
          boxShadow: '',
          rotateSpeed: 230,
          borderWidth: 26,
          diameter: 300,
      },
      
      forSlices: {
          sliceColor: "rgba(0,0,0,.9)",
          transparencyStop: 230,
          sliceWidth: 670,
          sliceHeight: 1,
          sliceCount: 10,
      }
  },
  
  // thin, outermost blue with box-shadow glow
  {      
      forBlueCircle: {
          borderColor: "rgba(42, 151, 255,.8)",
          animation: "counter-clockwise",
          boxShadow: 'two',
          rotateSpeed: 45,
          borderWidth: 13,
          diameter: 400,
      },
      
      forSlices: {
        //   sliceColor: "rgba(0,0,0,1)",
          transparencyStop: 372,
          sliceWidth: 670,
          sliceHeight: 15,
          sliceCount: 14,
      }
  },
  
  // blue, slow, right, thick, middle
    {      
      forBlueCircle: {
          borderColor: "rgba(0,0,0,0)",
          animation: "clockwise",
          boxShadow: 'two',
          rotateSpeed: 90,
          borderWidth: 50,
          diameter: 276,
      },
      
      forSlices: {
          sliceColor: "rgba(42, 151, 255,.6)",
          transparencyStop: 274,
          sliceWidth: 340,
          sliceHeight: 100,
          sliceCount: 6,
      }
  },
  
  
  // innermost-white, slow, left, slices
  {      
      forBlueCircle: {
          borderColor: "rgba(255,255,255,.3)",
          animation: "counter-clockwise",
          boxShadow: '',
          rotateSpeed: 260,
          borderWidth: 0,
          diameter: 288,
      },
      
      forSlices: {
          sliceColor: "rgba(255,255,255,1)",
          transparencyStop: 287,
          sliceWidth: 340,
          sliceHeight: 60,
          sliceCount: 10,
      }
  },
  
  
  
  // inner blue right slow
  {      
      forBlueCircle: {
          borderColor: "",
          animation: "clockwise",
          boxShadow: '',
          rotateSpeed: 260,
          borderWidth: 0,
          diameter: 300,
      },
      
      forSlices: {
          sliceColor: "rgba(42, 151, 255,.9)",
          transparencyStop: 303,
          sliceWidth: 340,
          sliceHeight: 30,
          sliceCount: 14,
      }
  },
  

  
  // outermost-white, thick, fast, rightward, outer
    {      
      forBlueCircle: {
          borderColor: "rgba(255, 255, 255,1)",
          animation: "clockwise",
          boxShadow: 'two',
          rotateSpeed: 55,
          borderWidth: 25,
          diameter: 378
      },
      
      forSlices: {
          sliceColor: "rgba(0,0,0,.55)",
          transparencyStop: 328,
          sliceWidth: 670,
          sliceHeight: 15,
          sliceCount: 14,
      }
  },
  
   //  2nd-to-outermost blue, leftward, slices, 
    {      
      forBlueCircle: {
          borderColor: "",
          animation: "counter-clockwise",
          boxShadow: '',
          rotateSpeed: 100,
          borderWidth: 0,
          diameter: 400,
      },
      
      forSlices: {
          sliceColor: "rgba(42, 151, 255,.7)",
          transparencyStop: 351,
          sliceWidth: 379,
          sliceHeight: 70,
          sliceCount: 5,
      }
  },

   // blueish layer on top of everything
  {      
      forBlueCircle: {
          borderColor: "",
          animation: "",
          boxShadow: 'one',
          rotateSpeed: 0,
          borderWidth: 0,
          diameter: 300,
      },

      forSlices: {
          sliceColor: "rgba(0,0,0,.16)",
          transparencyStop: 298,
          sliceWidth: 670,
          sliceHeight: 30,
          sliceCount: 12,
      }
  },
  
]

cores.forEach(core => createCore(core))

// document.addEventListener('DOMContentLoaded', () => {
//     const container = document.querySelector(".container")
//     const pulseWave = document.querySelector("#pulse")
//     const glowingOrb = document.querySelector("#orb")

//     // pulseWave.addEventListener("animationstart", () => particles.bigBang())
//     pulseWave.addEventListener("animationend",   () => pulseWave.remove())
//     glowingOrb.addEventListener("animationend",  () => particles.bigBang(), () => glowingOrb.remove())
    
//     coresAwaitingDOM.forEach(core => {
//         container.appendChild(core)
//     })
// })
    

// cores.forEach(core => createCore(core))