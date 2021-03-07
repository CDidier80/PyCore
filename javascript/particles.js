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

		this.canvas_id = canvas_id
		this.stage  = new createjs.Stage(canvas_id)
    this.canvas = document.getElementById(canvas_id)
		this.totalWidth  = this.canvasWidth  = this.canvas.width  = this.canvas.offsetWidth
		this.totalHeight = this.canvasHeight = this.canvas.height = this.canvas.offsetHeight
    this.xCenterPoint = this.totalWidth / 2,
    this.yCenterPoint = this.totalHeight / 2, 
    this.firstbigBang = true,

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

    // this.xCentralizedChance = .6
    // this.yCentralizedChance = .8
    this.xCentralizedChance = .5
    this.yCentralizedChance = .5

    this.centralizedParticleRange = {
      x: {
        setMinPosition: (baseXCoordinate) => baseXCoordinate + ((this.totalWidth - baseXCoordinate) / 4), 
        setMaxPosition: (baseXCoordinate) => baseXCoordinate + ((this.totalWidth - baseXCoordinate) * .75),
      },

      y: {
        setMinPosition: (areaHeight) => this.totalHeight * (2 - (areaHeight / 2)) / 4,
        setMaxPosition: (areaHeight) => this.totalHeight * (2 + (areaHeight / 2)) / 4,
      }
    }
        
    
		this.particleTypes = [
      /* many small, hollow particles */
        { 
          forParticleInstance: {
            yMovementRange: this.totalHeight,
            xMovementRange: this.totalWidth,
            particleColor: "#0cdbf3",
            baseXCoordinate: 0,
            baseYCoordinate: 0,
            travelDistance: 40,  
            particleWidth: 3,   
            areaHeight: .5, 
            alphaMax: 0.4, 
            blur: false, 
          },
          particleCount: 170, 
          id: "small",  
        }, 
        { 
          forParticleInstance: {
            yMovementRange: this.totalHeight,
            xMovementRange: this.totalWidth,
            particleColor: "#00D5FF",
            baseXCoordinate: 0,
            baseYCoordinate: 0,
            travelDistance: 40,  
            particleWidth: 3,   
            areaHeight: .5, 
            alphaMax: 0.4, 
            blur: false, 
          },
          particleCount: 70, 
          id: "small",  
        }, 

        /* several medium, blured particles */
        { 
          forParticleInstance: {
            yMovementRange: this.totalHeight,
            xMovementRange: this.totalWidth,
            // particleColor: "#6fd2f3", 
            particleColor: "#0cdbf3",
            travelDistance: 70,  
            baseXCoordinate: 0,
            baseYCoordinate: 0, 
            particleWidth: 8,   
            areaHeight: 1,  
            alphaMax: 0.3, 
            blur: true,  
          },
          particleCount: 80, 
          id: "medium", 
        }, 

        /* a few large, blured particles */
        { 
          forParticleInstance: {
            yMovementRange: this.totalHeight,  
            xMovementRange: this.totalWidth,
            particleColor: "#93e9f3",
            // particleColor: "#93e9f3",
            travelDistance: 125, 
            baseXCoordinate: 0,
            baseYCoordinate: 0, 
            particleWidth: 23,  
            areaHeight: 1,  
            alphaMax: .15, 
            blur: true,  
          },
          particleCount: 6,  
          id: "large",  
        }
    ]


        /**
         * ============================================================ *
         *                         makeParticles
         *
         * - uses the below particle methods to fully instantiate &
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
              this.drawParticle(particle)
              // this.setInitialParticlePosition(particle)
              particle.initX = particle.x = this.xCenterPoint
              particle.initY = particle.y = this.yCenterPoint
              this.stage.addChild(particle)
              setTimeout(()=>bigBang(particle), 3800)
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
            for (let key in forParticleInstance) {
                particle[key] = forParticleInstance[key]
            }
        }


        this.addRandomizedProperties = function(particle) {
            particle.scaleX = particle.scaleY = randomizeWithinRange(0.3, 1)
            particle.alpha = randomizeWithinRange(0, 0.1)
            particle.speed = randomizeWithinRange(2, 10)
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


        this.setCentralCoordinate = function(axis, base) {
            const { setMinPosition, setMaxPosition } = this.centralizedParticleRange[axis]
            const minPosition = setMinPosition(base)
            const maxPosition = setMaxPosition(base)
            return randomizeWithinRange(minPosition, maxPosition)
        }

      // this.setPostExplosionPosition = function(particle){

      //     const { 
      //       baseXCoordinate, 
      //       baseYCoordinate,
      //       xMovementRange, 
      //       yMovementRange,  
      //       areaHeight, 
      //   } = particle

      //   const args = [baseXCoordinate, xMovementRange, baseYCoordinate, yMovementRange, areaHeight]
      //   args.forEach(arg => setZeroIfFalsey(arg)) 

      //   const xNearCenter = Math.random() <= this.xCentralizedChance
      //   const yNearCenter = Math.random() <= this.yCentralizedChance

      //     particle.initX = particle.x = xNearCenter ? 
      //         this.setCentralCoordinate("x", baseXCoordinate) :
      //         randomizeWithinRange(baseXCoordinate, xMovementRange)

      //     particle.initY = particle.y = yNearCenter ? 
      //         this.setCentralCoordinate("y", areaHeight) :
      //         randomizeWithinRange(baseYCoordinate, yMovementRange)
            
      //   }


		this.setInitialParticlePosition = function(particle) {

        const { 
            baseXCoordinate, 
            baseYCoordinate,
            xMovementRange, 
            yMovementRange,  
            areaHeight, 
        } = particle

        const args = [baseXCoordinate, xMovementRange, baseYCoordinate, yMovementRange, areaHeight]
        args.forEach(arg => setZeroIfFalsey(arg)) 

        // const xNearCenter = Math.random() <= this.xCentralizedChance
        // const yNearCenter = Math.random() <= this.yCentralizedChance

        // if(this.firstbigBang){

        // } else {
        //   particle.initX = particle.x = xNearCenter ? 
        //       this.setCentralCoordinate("x", baseXCoordinate) :
        //       randomizeWithinRange(baseXCoordinate, xMovementRange)

        //   particle.initY = particle.y = yNearCenter ? 
        //       this.setCentralCoordinate("y", areaHeight) :
        //       randomizeWithinRange(baseYCoordinate, yMovementRange)
        // }
		}

        /**
         * ==============================================
         *            Particle Animations
         * 
         *  Each particle endlessly cycles between
         *  the "animateParticle" and "fadeout" animations
         * ==============================================
         */

    const bigBang = function(particle) {
        const { speed, initX, initY, travelDistance, alphaMax } = particle
        let endScale = randomizeWithinRange(0.3, 1);
        let xDestination = randomizeWithinRange(engine.xCenterPoint - travelDistance * 15, engine.xCenterPoint + travelDistance * 15)
        let yDestination = randomizeWithinRange(engine.yCenterPoint - travelDistance * 15, engine.yCenterPoint + travelDistance * 5)
        const greaterAlpha = randomizeWithinRange(0.1, alphaMax)

        const endExplosionState = { 
          scaleX: endScale, 
          scaleY: endScale, 
          x: xDestination, 
          y: yDestination, 
          ease: Cubic.easeInOut,
          onComplete: animateParticle, 
          onCompleteParams:[particle], 
          alpha: greaterAlpha, 
        }
        TweenMax.to(particle, speed, {...endExplosionState})
    }

		const animateParticle = function(particle) {
        const { speed, initX, initY, travelDistance, alphaMax, x, y } = particle
        // if (initX === engine.xCenterPoint || initY === engine.yCenterPoint) {
        //   engine.setPostExplosionPosition(particle)

        // }
        let endScale = randomizeWithinRange(0.3, 1);
        let xDestination = randomizeWithinRange(x - travelDistance, x + travelDistance)
        let yDestination = randomizeWithinRange(y - travelDistance, y + travelDistance)
        const greaterAlpha = randomizeWithinRange(0.1, alphaMax)

        const firstEndState = { 
          scaleX: endScale, 
          scaleY: endScale, 
          x: xDestination, 
          y: yDestination, 
          ease: Cubic.easeInOut,
          onComplete: animateParticle, 
          onCompleteParams:[particle], 
          alpha: greaterAlpha, 
        }
        TweenMax.to(particle, speed, {...firstEndState})	
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
        this.totalWidth  = this.canvasWidth  = this.canvas.width = this.canvas.offsetWidth
        this.totalHeight = this.canvasHeight = this.canvas.height = this.canvas.offsetHeight
        this.render()
        this.particleArray.forEach(particle => this.setInitialParticlePosition(particle))
    }

		this.makeParticles()
    if(this.firstbigBang){
        this.firstbigBang = false
        this.render()
    }

 }
 return ParticleEngine
}());


/**
 *                      HELPERS
 * =======================================================
 */

const randomizeWithinRange = (min, max) => min + ((max - min) * Math.random())


const setZeroIfFalsey = (variable) => !variable && (variable = 0)


/**
 * =======================================================
 *                      RUN CODE
 * =======================================================
 */

let particles

const activateParticles = () => {
  console.log("running")
    particles = new ParticleEngine('projector')
    createjs.Ticker.addEventListener("tick", updateCanvas)
    window.addEventListener('resize', resizeCanvas)
    function updateCanvas(){particles.render()}
    function resizeCanvas(){particles.resize()}
}

activateParticles()
