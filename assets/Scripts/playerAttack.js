// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.body=this.node.getComponent(cc.RigidBody)
        this.playerBody=cc.find("Canvas/player").getComponent(cc.RigidBody)
        if(this.node.name!="jumpAttack")
            this.body.gravityScale=0
        this.body.linearVelocity=this.playerBody.linearVelocity
    },

    // update (dt) {},
    onBeginContact(contact, selfCollider, otherCollider) {
        if(otherCollider.node.group=="enemy"){
            //this.otherCollider.node.onDamaged()
        }

    },
});
