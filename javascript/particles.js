let mobile = window.innerWidth < 770 && window.innerHeight < 770
let htmlUsingScript = (window.location.pathname).split("/").pop()


let ParticleEngine = (function() {
	'use strict'

	function ParticleEngine(canvas_id, useBigBang = true) {
		// enforces new
		if (!(this instanceof ParticleEngine)) return new ParticleEngine(args)
		
    this.canvas = document.createElement('canvas')
    this.canvas.id = canvas_id
		this.stage  = new createjs.Stage(this.canvas)
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
		this.totalWidth  = this.canvasWidth  = this.canvas.width  = this.canvas.width
		this.totalHeight = this.canvasHeight = this.canvas.height = this.canvas.height
    this.xCenterPoint = this.totalWidth / 2,
    this.yCenterPoint = this.totalHeight / 2, 
    this.firstbigBang = true
    this.useBigBang = useBigBang


    this.particleArray = []  
    
		this.particleTypes = [
      /* many small, hollow particles */
        { 
          forParticleInstance: {
            particleColor: "#0cdbf3",
            baseXCoordinate: 0,
            baseYCoordinate: 0,
            travelDistance: 60,  
            particleWidth: 3,   
            areaHeight: .5, 
            alphaMax: 0.4, 
            blur: false, 
          },
          particleCount: mobile ? 20 : 150, 
          id: "small",  
        }, 
        { 
          forParticleInstance: {
            particleColor: "#00D5FF",
            baseXCoordinate: 0,
            baseYCoordinate: 0,
            travelDistance: 50,  
            particleWidth: 3,   
            areaHeight: .5, 
            alphaMax: 0.4, 
            blur: false, 
          },
          particleCount: mobile ? 5 : 0, 
          id: "small",  
        }, 

        /* several medium, blured particles */
        { 
          forParticleInstance: {
            particleColor: "#0cdbf3",
            travelDistance: 70,  
            baseXCoordinate: 0,
            baseYCoordinate: 0, 
            particleWidth: 8,   
            areaHeight: 1,  
            alphaMax: 0.3, 
            blur: true,  
          },
          particleCount: mobile ? 0 : 35, 
          id: "medium", 
        }, 

        /* a few large, blured particles */
        { 
          forParticleInstance: {
            particleColor: "#93e9f3",
            travelDistance: 150, 
            baseXCoordinate: 0,
            baseYCoordinate: 0, 
            particleWidth: 23,  
            areaHeight: 1,  
            alphaMax: .1, 
            blur: true,  
          },
          particleCount: mobile ? 0 : 5,  
          id: "large",  
        }
    ]


		this.makeParticles = function() {
        this.particleTypes.forEach(particleType => {
            const {                
              id, 
              particleCount,
              forParticleInstance,
            } = particleType
            for (let i = 0; i < particleCount; i++ ){
              let particle = new createjs.Shape()
              this.addStaticProperties(particle, forParticleInstance, id)
              this.addRandomizedProperties(particle)
              this.precalculateDestinations(particle)
              this.drawParticle(particle)
              this.stage.addChild(particle)
              this.particleArray.push(particle)
            }
        })	
		 }


    this.addStaticProperties = function(particle, forParticleInstance, id) {
        particle.flag = id
        this.setInitialPosition(particle)
        for (let key in forParticleInstance) {
            particle[key] = forParticleInstance[key]
        }
    }


    this.setInitialPosition = function(particle){
        if (this.useBigBang) {
          particle.x = this.totalWidth / 2
          particle.y = this.totalHeight / 2
        } else {
          particle.x = randomizeWithinRange(0, this.totalWidth)
          particle.y = randomizeWithinRange(0, this.totalHeight)
        }
    }


    this.addRandomizedProperties = function(particle) {
      particle.scaleX = particle.scaleY = randomizeWithinRange(0.3, 1)
      particle.endScale = randomizeWithinRange(0.3, 1)
      particle.alpha = randomizeWithinRange(0, 0.1)
      particle.speed = randomizeWithinRange(4, 10)
      /* big bang randomization */
      particle.xExplosionDestination = randomizeWithinRange(0, this.totalWidth)
      particle.yExplosionDestination = randomizeWithinRange(0, this.totalHeight)
      particle.bigBangSpeed = randomizeWithinRange(1, 4.5)
    }


      this.precalculateDestinations = function(particle){
          const { xExplosionDestination: x, yExplosionDestination: y, travelDistance} = particle
          const firstX = randomizeWithinRange(x - travelDistance, x + travelDistance)
          const firstY = randomizeWithinRange(y - travelDistance, y + travelDistance)
          let destinations = [[firstX, firstY]]
          for (let i=1; i<=15; i++){
              const prevX = destinations[i-1][0]
              const prevY = destinations[i-1][1]
              const [nextX, nextY] = makeRandomCoordinates(prevX, prevY, travelDistance)
              destinations.push([nextX, nextY])
          }
          particle.destinations = destinations.concat([...destinations].reverse())
          particle.moveCount = 0
      }


      this.findNextCircleCoordinates = function(radius, angle){
          const nextX = Math.cos(angle) * radius + this.xCenterPoint
          const nextY = Math.sin(angle) * radius + this.yCenterPoint
          return [nextX, nextY]
      }


      this.drawParticle = function(particle) {
          const { blur, particleColor, particleWidth } = particle
          particle.graphics.beginFill(particleColor).drawCircle(0, 0, particleWidth)
          blur ? this.drawBlurredParticle(particle) : this.drawClearParticle(particle)
      }


      this.drawBlurredParticle = function(particle) {
          const { particleWidth, particleColor} = particle
          let blurFilter = new createjs.BlurFilter(particleWidth / 2, particleWidth / 2, 1)
          particle.filters = [blurFilter]
          let bounds = blurFilter.getBounds()
          particle.graphics.beginStroke(particleColor).setStrokeStyle(1).drawCircle(0, 0, particleWidth);
          particle.cache(-50+bounds.x, -50+bounds.y, 100+bounds.width, 100+bounds.height)
      }


      this.drawClearParticle = function(particle) {
          const { particleWidth, particleColor } = particle
          particle.graphics.beginStroke(particleColor).setStrokeStyle(1).drawCircle(0, 0, particleWidth);
      }


      const scatterParticle = function(particle) {
          const { 
            xExplosionDestination, 
            yExplosionDestination, 
            bigBangSpeed, 
            endScale,
            alphaMax,
          } = particle

          const endExplosionState = { 
            alpha: alphaMax, 
            scaleY: endScale, 
            scaleX: endScale, 
            ease: Cubic.easeInOut,
            x: xExplosionDestination, 
            y: yExplosionDestination, 
            onCompleteParams:[particle], 
            onComplete: animateParticle, 
          }
          TweenMax.to(particle, bigBangSpeed, {...endExplosionState})
      }


      const animateParticle = function(particle) {
          const { speed, alphaMax, destinations, moveCount } = particle
          let endScale = randomizeWithinRange(0.3, 1);
          const greaterAlpha = randomizeWithinRange(0.1, alphaMax)
          const shouldCountReset = moveCount === destinations.length - 1

          const endState = { 
            moveCount: shouldCountReset ? 0 : moveCount + 1,
            y: destinations[moveCount][1], 
            x: destinations[moveCount][0], 
            onComplete: animateParticle, 
            onCompleteParams:[particle], 
            ease: Cubic.easeInOut,
            alpha: greaterAlpha, 
            scaleX: endScale, 
            scaleY: endScale, 
          }
          TweenMax.to(particle, speed, {...endState})	
      }
	

      this.bigBang = function(){
        this.particleArray.forEach(particle => scatterParticle(particle))
      }

      // a big bang alternative - skip explosion and immediately assume first position
      // after minor scatter
      this.takeFirstPosition = function() {
        this.particleArray.forEach(particle => animateParticle(particle))
      }


      this.render = function() {
        this.stage.update()
      } 

      this.resize = function() {
          this.totalWidth  = this.canvasWidth  = this.canvas.width = window.innerWidth
          this.totalHeight = this.canvasHeight = this.canvas.height = window.innerHeight
          this.render()
      }

      this.makeParticles()
      if(this.firstbigBang){
          this.firstbigBang = false
          this.render()
      }
 }

 return ParticleEngine
}())


const randomizeWithinRange = (min, max) => min + ((max - min) * Math.random())

const makeRandomCoordinates = (xStart, yStart, travelDistance) => {
    const nextX = randomizeWithinRange(xStart - travelDistance, xStart + travelDistance)
    const nextY = randomizeWithinRange(yStart - travelDistance, yStart + travelDistance)
    return [nextX, nextY]
}

const findHypotenuse = (x, y) => Math.sqrt((x * x) + (y * y))

const toDegrees = (radians) => radians * (180 / Math.PI)

const setZeroIfFalsey = (variable) => !variable && (variable = 0)


const activateParticles = (htmlUsingScript) => {
    const noBigBang = htmlUsingScript === "editor.html"
    const particles = new ParticleEngine('projector', !noBigBang)
    createjs.Ticker.addEventListener("tick", updateCanvas)
    window.addEventListener('resize', resizeCanvas)
    function updateCanvas(){particles.render()}
    function resizeCanvas(){particles.resize()}
    return particles
}

let particles = activateParticles(htmlUsingScript)

ParticleEngine = null
