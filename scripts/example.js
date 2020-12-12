let blocks = [
    { type: LiveBlockTypes.CLIMATE },
    { type: LiveBlockTypes.SWITCH },
    { type: LiveBlockTypes.LIGHT },
    { type: LiveBlockTypes.FAN }
]

function createLiveBlocks() {
    let liveBlocks = []
    let liveBlock = {}
    blocks.forEach(block => {
        switch (block.type) {
            case LiveBlockTypes.CLIMATE:
                liveBlock = new LiveBlockClimate()
                climateBlock = liveBlock
                climateBlock
                break;
            case LiveBlockTypes.SWITCH:
                liveBlock = new LiveBlockBinarySwitch()
                liveBlock.titleText = "Switch"
                break;
            case LiveBlockTypes.LIGHT:
                liveBlock = new LiveBlockDimmableSwitch()
                liveBlock.titleText = "Light"
                break;
            case LiveBlockTypes.FAN:
                liveBlock = new LiveBlockBinarySwitch()
                liveBlock.titleText = "Fan"
                break;
        }
        liveBlocks.push(liveBlock)
    })
    return liveBlocks;
}

let liveBlocks = []

window.addEventListener('load', () => {
    liveBlocks = createLiveBlocks()
    layoutLiveBlock(liveBlocks, document.body)
    liveBlocks[0].setClimate(15, 40)
})

window.addEventListener('resize', () => {
    removeLiveBlock(liveBlocks)
    layoutLiveBlock(liveBlocks, document.body)
})