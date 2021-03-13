(()=>{

    class SVGContainer {
        constructor(svg){
            this.div = document.createElement("div")
            this.div.classList.add("bolt-container")
            this.div.appendChild(svg)
        }
        render(){
            return this.div
        }
    }

    let svgCount = 0
    
    class SVG {
        constructor(svgID){
            svgCount++
            this.svg = this.create("svg")
            this.svgID = svgID || `svg-${svgCount}`
            this.defs = this.create("defs")
            this.filter = this.create("filter")
            this.feGaussianBlur = this.create("feGaussianBlur")
            this.g = this.create("g")
            this.path1 = this.create("path")
            this.path2 = this.create("path")
        }
    
        setAttributes(){
            this.svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
            this.svg.id = this.svgID
            this.filter.id = `filter-${svgCount}`
            this.filter.setAttribute("x", "0")
            this.filter.setAttribute("y", "0")
            this.feGaussianBlur.setAttribute("in", "SourceGraphic")
            this.feGaussianBlur.setAttribute("stdDeviation", "5")
            this.path1.setAttribute("fill", "none")
            this.path1.setAttribute("stroke", "#00FFFB")
            this.path1.setAttribute("filter", "url(#f1)")
            this.path2.setAttribute("stroke", "#00FFFB")
            this.path2.setAttribute("fill", "none")
        }
    
        addChildren(){
            this.filter.appendChild(this.feGaussianBlur)
            this.defs.appendChild(filter)
            this.svg.appendChild(defs)
            this.g.appendChild(this.path1)
            this.g.appendChild(this.path2)
            this.svg.appendChild(this.g)
        }
    
        create(element){
            return document.createElement(element)
        }
    
        render(){
            this.setAttributes()
            this.addChildren()
            return this.svg
        }
    }
    
    
    class Electricity {
        constructor(
            svg, 
            parent, 
            isHorizontal=true, 
            percAllowedSpread=.35, 
            border=null,
            branchPoints=10
        ) {
            this.svg = svg
            this.animationID
            this.parent = parent
            this.isHorizontal = isHorizontal
            this.border = border
            this.width = parent.offsetWidth
            this.height = parent.offsetHeight
            this.electricBranchPoints = branchPoints
            this.percAllowedSpread = percAllowedSpread
            this.spaceBetweenPoints
            this.boltSpread
            this.startPoint
            this.endPoint
            this.setBoltProps = this.border ? this.setBorderBoltProps : this.setRandomBoltProps
            this.makePath = (()=>{
                if(!this.border) return this.isHorizontal ? this.makeHorizontalPath : this.makeVerticalPath
                if(this.border === "top" || this.border === "bottom") return this.makeHorizontalPath
                return this.makeVerticalPath
            })()
        }
        
        setRandomBoltProps(){
            this.spaceBetweenPoints = (this.isHorizontal ? this.width : this.height) / this.electricBranchPoints
            this.boltSpread = (this.isHorizontal ? this.height : this.width) * this.percAllowedSpread
    
            this.startPoint = this.isHorizontal ? 
                [0, this.height / 2] : 
                [this.width / 2, 0]
            
            this.endPoint = this.isHorizontal ? 
                [this.width, this.height /2 ] : 
                [this.width / 2, this.height]
        }
    
        setBorderBoltProps(){
            this.border = "top"    && (this.startPoint = [0,0], this.endPoint = [this.width, 0])
            this.border = "bottom" && (this.startPoint = [0, this.height], this.endPoint = [this.width, this.height])
            this.border = "left"   && (this.startPoint = [0,0], this.endPoint = [0, this.height])
            this.border = "right"  && (this.startPoint = [this.width, 0], this.endPoint = [this.width, this.height])
        }
    
        makeHorizontalPath() {
            let branchPoints = [this.startPoint,]
            for(let i = 0; i < this.electricBranchPoints; i++) {
                let xPoint = (this.spaceBetweenPoints * i) + (Math.cos(i) * this.spaceBetweenPoints)
                let yPoint = this.plotInBoltRange(this.height) 
                branchPoints.push([xPoint, yPoint])
            }
            branchPoints.push(this.endPoint)
            let d = branchPoints.map((point) => point.join(','))
            return 'M' + d.join(',')
        }
    
        makeVerticalPath() {
            let branchPoints = [this.startPoint,]
            for(let i = 0; i < this.electricBranchPoints; i++) {
                let yPoint = (this.spaceBetweenPoints * i) + (Math.cos(i) * this.spaceBetweenPoints)
                let xPoint =  + this.plotInBoltRange(this.width)
                branchPoints.push([xPoint, yPoint])
            }
            branchPoints.push(this.endPoint)
            let d = branchPoints.map((point) => point.join(','))
            return 'M' + d.join(',')
        }
        
        randPosOrNeg(){return Math.random() < .5 ? 1 : -1}
        
        plotInBoltRange(dimension) {
            const baseline = dimension / 2
            return Math.random() * this.boltSpread/2 * this.randPosOrNeg() + baseline
        }
        
        resize(){
            this.width = this.parent.offsetWidth
            this.height = this.parent.offsetHeight
            this.setBoltProps()
        }
        
        // initialize at top level so other methods have access
        loop (){}
        
        start() {
            if(this.animationID) return
            this.setBoltProps()
            let now, delta
            let fps = 25
            let then = Date.now()
            let interval = 1000/fps
            this.loop = () => {
                this.animationID = requestAnimationFrame(this.loop)
                now = Date.now()
                delta = now - then
                if (delta > interval) {
                    then = now - (delta % interval)
                    this.render()
                }
            }
            this.loop()
        }
        
        stop() {
            cancelAnimationFrame(this.animationID)
            this.animationID = null
        }
    
        render() {
            // svg attr d is draw path
            let pointsSVGd = this.makePath()
            let paths = this.svg.querySelectorAll('path')
            paths[0].setAttribute('d', pointsSVGd)
            paths[1].setAttribute('d', pointsSVGd)
        }
    } // end class
    
      
      /* configuration functions */

    const makeBorderSVGs = (svg, container) => {
        let spread = .1
        let branchPoints = 10

        let top = new Electricity(svg, container, true, spread, "top", branchPoints)
        let bottom = new Electricity(svg, container, true, spread, "bottom", branchPoints)
        let left = new Electricity(svg, container, false, spread, "left", branchPoints)
        let right = new Electricity(svg, container, false, spread, "right", branchPoints)
        return [top, bottom, left, right]
    }
    
    const addBorderSVGs = () => {
        const editor = document.querySelector("#ace-editor")
        const terminal = document.querySelector("#terminal")
        let [editorSVG, terminalSVG] = [new SVG("svg-editor"), new SVG("svg-terminal")]
        let editorBoltBorders = makeBorderSVGs(editorSVG, editor)
        let terminalBoltBorders = makeBorderSVGs(terminalSVG, terminal)
        return [editorBoltBorders, terminalBoltBorders]
    }
    
    window.addEventListener("load", () => {
        let borderBolts = addBorderSVGs()

        borderBolts.forEach(set => {
            set.forEach(borderBolt => {
                borderBolt.start()
            })
        })

        window.addEventListener("resize", () => {
        borderBolts.forEach(set => {
            set.forEach(borderBolt => {
                borderBolt.resize()
            })
        })
        })
    })

})()
