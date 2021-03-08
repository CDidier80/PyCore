
let ParticleEngine = (function() {
	'use strict'

	function ParticleEngine(canvas_id) {
		// enforces new
		if (!(this instanceof ParticleEngine)) return new ParticleEngine(args)
    const engine = this
		
        
    /**
         * ==============================
         *     Set Canvas & Stage
         * ==============================
         */

    this.canvas = document.createElement('canvas')
    this.canvas.id = canvas_id
		this.stage  = new createjs.Stage(this.canvas)
    // this.canvas = document.getElementById(canvas_id)
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
		this.totalWidth  = this.canvasWidth  = this.canvas.width  = this.canvas.width
		this.totalHeight = this.canvasHeight = this.canvas.height = this.canvas.height
		// this.totalWidth  = this.canvasWidth  = this.canvas.width  = this.canvas.offsetWidth
		// this.totalHeight = this.canvasHeight = this.canvas.height = this.canvas.offsetHeight
    this.xCenterPoint = this.totalWidth / 2,
    this.yCenterPoint = this.totalHeight / 2, 
    this.firstbigBang = true
    // this.circleWaypoints = 360
    // this.radianIncrement = Math.PI * 2 / this.circleWaypoints
    // this.incrementInRadians = this.angleIncrement * Math.PI / 180

    /**
         * ==========================================================================
         *                        CREATE PARTICLE SETTINGS
         * 
         *  - particles are placed near canvas center OR randomly across the canvas 
         *    according to a percentage chance 
         * 
         *  - if a particle is assigned to the center, it's range of motion
         *    is tightly restricted to maintain particle density
         * 
         *  - higher chance of x-axis centralization causes a more vertical particle 
         *    dispersion
         * 
         *  - higher chance of y-axis centralization causes more horizontal particle
         *    dispersion
         * 
         * ==========================================================================
         */
        

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
          particleCount: 150, 
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
          particleCount: 70, 
          id: "small",  
        }, 

        // /* several medium, blured particles */
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
          particleCount: 35, 
          id: "medium", 
        }, 

        // /* a few large, blured particles */
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
          particleCount: 5,  
          id: "large",  
        }
    ]


        /**
         * ============================================================ *
         *                         makeParticles
         *
         * - uses the below methods to fully instantiate &
         *.  configure the particles
         * ============================================================ *
         */                                                                          

		
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
              // this.plotCircularPath(particle)
              this.drawParticle(particle)
              this.stage.addChild(particle)
              this.particleArray.push(particle)
            }
        })	
		 }


        /**
         * ==============================================
         *        particle configuration methods 
         * ==============================================
         */


        this.addStaticProperties = function(particle, forParticleInstance, id) {
            particle.flag = id
            particle.x = this.totalWidth / 2
            particle.y = this.totalHeight / 2
            for (let key in forParticleInstance) {
                particle[key] = forParticleInstance[key]
            }
        }


        this.addRandomizedProperties = function(particle) {
            particle.scaleX = particle.scaleY = randomizeWithinRange(0.3, 1)
            particle.alpha = randomizeWithinRange(0, 0.1)
            particle.speed = randomizeWithinRange(4, 10)
            particle.bigBangSpeed = randomizeWithinRange(1, 4.5)
            particle.xExplosionDestination = randomizeWithinRange(0, this.totalWidth)
            particle.yExplosionDestination = randomizeWithinRange(0, this.totalHeight)
            particle.endScale = randomizeWithinRange(0.3, 1)
            // particle.clockwiseOrbit = Math.random() < .8 ? true : false
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


        // this.plotCircularPath = function(particle){
        //     const { xExplosionDestination: x, yExplosionDestination: y, clockwiseOrbit} = particle
        //     let xFromCenter = (x - this.xCenterPoint )
        //     let yFromCenter = (y - this.yCenterPoint )
        //     const radius = Math.hypot(yFromCenter, xFromCenter)
        //     const angle  = Math.atan2(yFromCenter, xFromCenter)
            
        //     let [nextX, nextY] = this.findNextCircleCoordinates(radius, angle)
        //     let circleDestinations = []
        //     for (let i = 1; i <= this.circleWaypoints; i++) {
        //         [nextX, nextY] = this.findNextCircleCoordinates(radius, angle + (this.radianIncrement * i * (clockwiseOrbit ? 1 : -1)))
        //         circleDestinations.push([nextX, nextY])
        //     }
        //     particle.circleDestinations = circleDestinations
        //     particle.orbitalSpeed = .0000002 * radius * radius
        // }


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


        /**
         * ==============================================
         *            Particle Animations
         * ==============================================
         */

    const scatterParticle = function(particle) {
        const { 
          endScale,
          alphaMax,
          bigBangSpeed, 
          yExplosionDestination, 
          xExplosionDestination, 
        } = particle

        const endExplosionState = { 
          scaleX: endScale, 
          scaleY: endScale, 
          x: xExplosionDestination, 
          y: yExplosionDestination, 
          ease: Cubic.easeInOut,
          onComplete: animateParticle, 
          onCompleteParams:[particle], 
          // onComplete: enterOrbit, 
          // onCompleteParams:[particle], 
          alpha: alphaMax, 
        }
        TweenMax.to(particle, bigBangSpeed, {...endExplosionState})
    }


    // const enterOrbit = function(particle) {
    //     const {circleDestinations, orbitalSpeed} = particle
    //     let orbitalTimeline = gsap.timeline({repeat: -1, smoothChildTiming: true, ease: Power4.easeInOut})
    //     for (let i=0; i<circleDestinations.length; i++){
    //         orbitalTimeline.to(particle, orbitalSpeed * (1 + (i/circleDestinations.length)), {x: circleDestinations[i][0] , y: circleDestinations[i][1]})
    //     }
    // }


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



        
		// function fadeout(particle, speed) {
		// 	particle.speed = randomizeWithinRange(2, 10)
    //   const endState = {
    //     alpha: 0,
    //     onComplete: animateParticle, 
    //     onCompleteParams:[particle], 
    //   }
		// 	TweenMax.to(particle, speed / 2, endState)
		// }

        /**
         * =========================================
         *            Render & Resize
         * =========================================
         */

    this.render = function() {
       this.stage.update()
    } 

    this.resize = function() {
        this.totalWidth  = this.canvasWidth  = this.canvas.width = window.innerWidth
        this.totalHeight = this.canvasHeight = this.canvas.height = window.innerHeight
        this.render()
        // this.particleArray.forEach(particle => this.setInitialParticlePosition(particle))
    }

		this.makeParticles()
    if(this.firstbigBang){
        this.firstbigBang = false
        this.render()
    }


 }
 return ParticleEngine
}())


/**
 *                      HELPERS
 * =======================================================
 */

const randomizeWithinRange = (min, max) => min + ((max - min) * Math.random())


const makeRandomCoordinates = (xStart, yStart, travelDistance) => {
    const nextX = randomizeWithinRange(xStart - travelDistance, xStart + travelDistance)
    const nextY = randomizeWithinRange(yStart - travelDistance, yStart + travelDistance)
    return [nextX, nextY]
}

const findHypotenuse = (x, y) => Math.sqrt((x * x) + (y * y))

const toDegrees = (radians) => radians * (180 / Math.PI)

const setZeroIfFalsey = (variable) => !variable && (variable = 0)


/**
 * =======================================================
 *                      RUN CODE
 * =======================================================
 */



const activateParticles = () => {
    const particles = new ParticleEngine('projector')
    createjs.Ticker.addEventListener("tick", updateCanvas)
    window.addEventListener('resize', resizeCanvas)
    function updateCanvas(){particles.render()}
    function resizeCanvas(){particles.resize()}
    return particles
}

const particles = activateParticles()


const addCanvas = () => {
  console.log(particles.canvas)
    document.body.prepend(particles.canvas)
    // particles.render()
    console.log(document.body)
}

