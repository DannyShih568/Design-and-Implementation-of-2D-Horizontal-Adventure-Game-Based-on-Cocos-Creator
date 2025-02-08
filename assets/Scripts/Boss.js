// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        boomPrefab: {
            default: null,
            type: cc.Prefab
        },
        hpBar:{
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.state="Boss_idle";
        this.ani=this.node.getComponent(cc.Animation);
        this.rb=this.node.getComponent(cc.RigidBody);
        this.isAttacking=false;
        this.attackspeed=200;
        this.jumpspeed=600;
        this.sp=cc.v2(0,0);
        this.tt=0;
        this.moveleft=false;
        this.moveright=false;
        this.playerNode = cc.find('Canvas/player');
        this.cNode=cc.find('Canvas')
        this.hitPoints=40
        this.death=false
    },

    attackend(){
        this.isAttacking=false;
    },



    changeState(state){
        if(state==this.state){
            return;
        }else{
            this.state=state
        }
        var anim = this.node.getComponent(cc.Animation)
        if(state=="Boss_idle"){
            anim.play("Boss_idle");
        }else if(state=="Boss_attack1"&&this.isAttacking==false){
            anim.play("Boss_attack1");
            this.isAttacking=true;
        }else if(state=="Boss_attack2"&&this.isAttacking==false){
            anim.play("Boss_attack2");
            this.isAttacking=true;
        }else if(state=="Boss_dash"&&this.isAttacking==false){
            anim.play("Boss_dash");
            this.isAttacking=true;
        }else if(state=="Boss_die"){
            anim.play("Boss_die");
        }
    },

    attackstart(){
        let v = this.rb.linearVelocity
        let distant=this.p_pos.x-this.b_pos.x;
        if(distant<0){
            this.node.scaleX=1;
        } else {this.node.scaleX=-1;
        }
            v.x=this.node.scaleX*-this.attackspeed;
            this.rb.linearVelocity=v;
            this.Boom();
    },

    Boom(){
        let boom = cc.instantiate( this.boomPrefab);
        boom.parent=this.cNode;
        let p =this.node.position;
        boom.setPosition(p);  
    },

    attack2start(){
        let v = this.rb.linearVelocity
        let distant=this.p_pos.x-this.b_pos.x;
            v.x=distant*2;
            v.y=this.jumpspeed;
            this.rb.linearVelocity=v;
    },
    attack2end(){
        let distant=this.p_pos.x-this.b_pos.x;
        if(distant<0){this.node.scaleX=1;
            }else {
                this.node.scaleX=-1;
            }

    },

    dashstart(){
        let v = this.rb.linearVelocity
        let distant=this.p_pos.x-this.b_pos.x;
        v.x=2*distant;
        this.rb.linearVelocity=v;
    },


    dashend(){
        let distant=this.p_pos.x-this.b_pos.x;
        if(distant<0){this.node.scaleX=1;
            }else {
                this.node.scaleX=-1;
            }
    },

    bossAction(){
        if(this.playerNode==null||this.death)return
        this.p_pos=this.playerNode.position;    //主角的坐标位置
        this.b_pos=this.node.position;          //boss的坐标位置
        let x_distant=Math.abs(this.p_pos.x-this.b_pos.x);
        let attack=Math.floor(Math.random()*4);
        if (this.dash<=0){                      //当水平距离小于等于0
            this.changeState("Boss_dash");
            this.dash=8;
        }else  if(attack==3&&this.attack2<=0){
            this.changeState("Boss_attack2");
            this.attack2=5;
        }else if (attack<3&&this.attack1<=0){
            this.changeState("Boss_attack1");
            this.attack1=1.5;
            }
    },

    start () {
        this.attack1=0;
        this.attack2=0;
        this.dash=0;
        this.hp=this.hpBar.getComponent(cc.ProgressBar)
    },

    update (dt) {
        this.attack1-=dt;
        this.attack2-=dt;
        this.dash-=dt;
        if(!this.death){
            this.schedule(() => {
                this.bossAction()
                }, 3)
        }
        
        
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        if(otherCollider.node.group=="playerAttack"){
            this.hitPoints--
            console.log(this.hp);
            this.hp.progress=this.hitPoints/40
            if(this.hitPoints<=0){
                this.node.group="enemyDie"
                this.rb.gravityScale=0
                let v = this.rb.linearVelocity
                v.x=0
                v.y=0
                this.rb.linearVelocity=v
                this.death=true
                this.node.stopAllActions()
                this.node.getComponent(cc.PhysicsBoxCollider).destroy()
                this.changeState("Boss_die")
            }
        }

    },
    afterDie(){
        console.log("boss die");
        this.node.destroy()
        cc.find("Canvas/UI Camera/GameWin").getComponent(cc.Animation).play("gameOver")
    },
});
