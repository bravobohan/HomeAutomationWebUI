const LiveBlockTypes = {
    CLIMATE: 'climate',
    SWITCH: 'switch',
    FAN: 'fan',
    LIGHT: 'light'
}

class LiveBlockBase {
    constructor() {
        this.x = 0
        this.y = 0
        this.liveBlockRootElement = {}
    }

    get htmlElement() {
        this.liveBlockRootElement = document.createElement('div')
        this.liveBlockRootElement.setAttribute('style', `left:${this.x}px;top:${this.y}px`)
        this.liveBlockRootElement.className = "liveBlock"
        return this.liveBlockRootElement
    }

    removeFromDOM() {
        if (this.liveBlockRootElement.parentNode) {
            this.liveBlockRootElement.parentNode.removeChild(this.liveBlockRootElement)
        }
    }
}

class LiveBlockDisplay extends LiveBlockBase {
    constructor() {
        super()
    }
}

class LiveBlockClimate extends LiveBlockBase {
    constructor() {
        super()
        this._temperatureValue = 0.0
        this._humidityValue = 0.0
    }
    get htmlElement() {
        super.htmlElement
        
        let liveBlockRingDiv = document.createElement('div')
        liveBlockRingDiv.className = "liveBlockRingDiv"
        this.liveBlockRootElement.appendChild(liveBlockRingDiv)

        let liveBlockRingDivText = document.createElement('p')
        liveBlockRingDivText.id = "liveBlockRingDivText"
        liveBlockRingDivText.className = "liveBlockRingDivText"
        liveBlockRingDivText.innerHTML = `${this._temperatureValue.toFixed(1)}º`
        liveBlockRingDiv.append(liveBlockRingDivText)

        let liveBlockUnderRingText = document.createElement('p')
        liveBlockUnderRingText.id = "liveBlockUnderRingText"
        liveBlockUnderRingText.className = "liveBlockUnderRingText"
        liveBlockUnderRingText.innerHTML = `${this._humidityValue.toFixed(0)}%`
        this.liveBlockRootElement.appendChild(liveBlockUnderRingText)

        return this.liveBlockRootElement
    }
    setClimate(celsius, humidityPercentage) {
        this._temperatureValue = celsius
        this._humidityValue = humidityPercentage
        this.liveBlockRootElement.querySelector("#liveBlockRingDivText").innerHTML = `${this._temperatureValue.toFixed(1)}º`
        this.liveBlockRootElement.querySelector("#liveBlockUnderRingText").innerHTML = `${this._humidityValue.toFixed(0)}%`
    }
}

class LiveBlockImageAndText extends LiveBlockBase {
    constructor() {
        super()
        this.imageLink = undefined
        this.titleText = ""
        this.statusText = ""
        this._toggleON = false
        this.leftClickCallback = function () {}
        this.rightClickCallback = function () {}
    }
    get htmlElement() {
        super.htmlElement

        this.liveBlockRootElement.addEventListener('click', event => {
            this.toggleON = !this._toggleON
            this.leftClickCallback()
        })

        this.liveBlockRootElement.addEventListener('contextmenu', event => {
            event.preventDefault()
            this.rightClickCallback()
        })

        let liveBlockImageDiv = document.createElement('div')
        liveBlockImageDiv.id = "liveBlockImageDiv"
        liveBlockImageDiv.className = "livBlockImageDiv"
        this.liveBlockRootElement.appendChild(liveBlockImageDiv)

        let liveBlockTextDiv = document.createElement('div')
        liveBlockTextDiv.className = "liveBlockTextDiv"
        this.liveBlockRootElement.appendChild(liveBlockTextDiv)

        if (this.imageLink !== undefined) {
            let imageElement = document.createElement('img')
            imageElement.src = this.imageLink
            imageElement.className = "liveBlockImageDivImage"
            liveBlockImageDiv.appendChild(imageElement)
        }

        let titleTextElement = document.createElement('p')
        titleTextElement.id = "titleTextElement"
        titleTextElement.className = "liveBlockTextDivTitle"
        titleTextElement.innerHTML = this.titleText;
        liveBlockTextDiv.appendChild(titleTextElement)

        let statusTextElement = document.createElement('p')
        statusTextElement.id = "statusTextElement"
        statusTextElement.className = "liveBlockTextDivStatus"
        statusTextElement.innerHTML = this.statusText;
        liveBlockTextDiv.appendChild(statusTextElement)

        return this.liveBlockRootElement
    }
    set toggleON(value) {
        this._toggleON = value
        this.update()
    }
    update() {
        this.updateCSS()
        this.updateContent()
        this.updateImage()
    }
    updateImage() {
        if (this.imageLink !== undefined) {
            liveBlockImageDiv = this.liveBlockRootElement.querySelector('#liveBlockImageDiv')
            liveBlockImageDiv.removeChild(liveBlockImageDiv.firstChild)
            let imageElement = document.createElement('img')
            imageElement.src = this.imageLink
            imageElement.className = "liveBlockImageDivImage"
            liveBlockImageDiv.appendChild(imageElement)
        }
    }
    updateCSS() {
        if (this._toggleON) {
            this.liveBlockRootElement.className = "liveBlock liveBlock-ON"
            this.liveBlockRootElement.querySelector('#titleTextElement').className = "liveBlockTextDivTitle liveBlockTextDivTitle-ON"
            this.liveBlockRootElement.querySelector('#statusTextElement').className = "liveBlockTextDivStatus liveBlockTextDivStatus-ON"
        }
        else {
            this.liveBlockRootElement.className = "liveBlock"
            this.liveBlockRootElement.querySelector('#titleTextElement').className = "liveBlockTextDivTitle"
            this.liveBlockRootElement.querySelector('#statusTextElement').className = "liveBlockTextDivStatus"
        }
    }
    updateContent() {}
}

class LiveBlockBinarySwitch extends LiveBlockImageAndText {
    constructor() {
        super()
        this.statusText = "OFF"
        this.imageLink = "images/switch-off.png"
        this.toggle = function(value){}
        this.leftClickCallback = function() {
            this.toggle(this._toggleON)
        }
    }
    updateContent() {
        if (this._toggleON) {
            this.statusText = "ON"
            this.imageLink = "images/switch-on.png"
        }
        else {
            this.statusText = "OFF"
            this.imageLink = "images/switch-off.png"
        }
        this.liveBlockRootElement.querySelector('#statusTextElement').innerHTML = this.statusText
    }
}

class LiveBlockDimmableSwitch extends LiveBlockImageAndText {
    constructor() {
        super()
        this.statusText = "OFF"
        this.imageLink = "images/light-off.png"
        this._percentage = 100
    }
    updateContent() {
        if (this._toggleON) {
            this.statusText = `${this._percentage.toFixed(0)}%`
            this.imageLink = "images/light-on.png"
        }
        else {
            this.statusText = "OFF"
            this.imageLink = "images/light-off.png"
        }
        this.liveBlockRootElement.querySelector('#statusTextElement').innerHTML = this.statusText
    }
    set percentage(value) {
        console.log(value)
        this._percentage = value
        this.updateContent()
    }
}

function layoutLiveBlock(liveBlocks, containerElement) {
    let row = 0
    let col = 0
    liveBlocks.forEach((liveBlock) => {
        let x = 20 + col * (105 + 20)
        let y = 20 + row * (105 + 20)
        if (x + 100 >= containerElement.clientWidth) {
            col = 0
            row++
            x = 20 + col * (105 + 20)
            y = 20 + row * (105 + 20)
        }
        col++
        liveBlock.x = x
        liveBlock.y = y
        containerElement.appendChild(liveBlock.htmlElement)
    })
}

function removeLiveBlock(liveBlocks) {
    liveBlocks.forEach(liveBlock => {
        liveBlock.removeFromDOM()
    })
}