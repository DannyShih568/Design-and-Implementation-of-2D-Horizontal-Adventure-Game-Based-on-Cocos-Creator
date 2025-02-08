// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        enemy:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.flashTime=0
    },

    update (dt) {
        
        if(this.flashTime<=0){
            e = cc.instantiate(this.enemy)
            this.node.addChild(e);
            console.log(this.node.getChildByName("enemy").position);

            this.flashTime=5

        }else{
            this.flashTime-=dt
        }
    },
});
