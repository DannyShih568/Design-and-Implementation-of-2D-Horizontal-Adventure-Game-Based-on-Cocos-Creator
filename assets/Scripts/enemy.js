// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.death=false
        this.runSpeed=200
        this.changeState("idle")
        this.body=this.node.getComponent(cc.RigidBody)
        this.player=cc.find("Canvas/player")
        this.state="idle"
    },

    update (dt) {
        // if(this.body.linearVelocity.y==0){
        //     let v = this.body.linearVelocity
        //     //v.x=-200*this.node.scaleX
        //     v.y=45
        //     this.body.linearVelocity=v
        // }
        if(this.player==null)return
        let v = this.body.linearVelocity
        if(v.x==0&&this.state=="attack"){
            this.state="idle"
        }
        if(!this.death){
            if(Math.abs(this.player.x-(this.node.x+this.node.parent.x))<=300&&this.state!="ready"&&this.state!="attack"){
                if(this.player.x<(this.node.x+this.node.parent.x))this.node.scaleX=1
                else this.node.scaleX=-1

                this.state="ready"
                v.x=0
                this.changeState("readyAttack")
                this.body.linearVelocity=v

            }else if(this.player.x<(this.node.x+this.node.parent.x)&&this.state=="idle"){
                this.isAttacking=false
                this.node.scaleX=1
                if(v.x==0)
                    this.changeState("move")
                v.x=this.runSpeed*-1
                this.body.linearVelocity=v
            }else if(this.player.x>(this.node.x+this.node.parent.x)&&this.state=="idle"){
                this.isAttacking=false
                this.node.scaleX=-1
                if(v.x==0)
                    this.changeState("move")
                v.x=this.runSpeed
                this.body.linearVelocity=v
            }
        }
    },

    changeState(state){
        var anim = this.node.getComponent(cc.Animation)
        if(state=="idle"){
            anim.play("idle")
        }else if(state=="move"){
            anim.play("move")
        }else if(state=="die"){
            anim.play("die")
        }else if(state=="readyAttack"){
            anim.play("readyAttack")
        }else if(state=="attack"){
            anim.play("attack")
        }
    },
    attack(){
        this.changeState("attack")
        this.state="attack"
        let v = this.body.linearVelocity
        v.x=this.runSpeed*-2*this.node.scaleX
        this.body.linearVelocity=v
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        if(otherCollider.node.group=="playerAttack"){
            this.node.group="enemyDie"
            this.body.gravityScale=0
            let v = this.body.linearVelocity
            v.x=0
            v.y=0
            this.body.linearVelocity=v
            this.node.stopAllActions()
            this.node.getComponent(cc.PhysicsBoxCollider).destroy()
            this.onDamaged()
        }else if(otherCollider.node.group=="ground"){
            
        }

    },
    onEndContact(contact, selfCollider, otherCollider) {
        
        
    },
    afterDie(){
        console.log("enemy die");
        this.node.destroy()
    },

    onDamaged(){
        this.death=true
        this.changeState("die")

    }
});
