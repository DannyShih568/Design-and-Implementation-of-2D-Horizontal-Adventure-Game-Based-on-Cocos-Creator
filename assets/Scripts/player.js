// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode:cc.Node,
        normalAttack1:{
            default: null,
            type: cc.Prefab
        },
        normalAttack2:{
            default: null,
            type: cc.Prefab
        },
        normalAttack3:{
            default: null,
            type: cc.Prefab
        },
        jumpAttack:{
            default: null,
            type: cc.Prefab
        },
        runAttack:{
            default: null,
            type: cc.Prefab
        },
        dashAttack:{
            default: null,
            type: cc.Prefab
        },
        hpBar:{
            default: null,
            type: cc.Node
        },
        slashAudio: {
            default: null,
            type: cc.AudioClip
            //cc.audioEngine.play(this.slashAudio, false, 1);
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.playerRunSpeed=300
        window.playerJumpSpeed=500
        window.state="null"
        window.isGround=false
        window.attackCount=0
        window.attackFlag=false
        window.isAttacking=false
        window.isDashing=false
        window.isRuning=false
        window.dashCoolDown=0
        window.mutekiTime=0
        window.touchWall=false
        window.isWall=false
        window.isHurting=false
        window.hitPorints=10
    },

    start () {
        this.changeState("jumpDown")
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
        this.body=this.node.getComponent(cc.RigidBody)
        this.collid=this.node.getComponent(cc.PhysicsBoxCollider)
        this.hp=this.hpBar.getComponent(cc.ProgressBar)
        console.log(this.node);
    },



    update (dt) {
        //console.log(window.isGround+" "+window.isWall);
        //console.log(window.isRuning+" "+window.isDashing);
        this.cameraMove()
        if(window.mutekiTime>0){
            window.mutekiTime-=dt;
        }
        if(window.dashBoost){
            this.body.linearVelocity.x+=10
        }
        if(window.dashCoolDown!=0)window.dashCoolDown--
        if(window.isWall){
            this.body.gravityScale=0
        }else{
            this.body.gravityScale=1
        }
        if(window.isRuning&&!window.isHurting){
            let v = this.body.linearVelocity
            if(Math.abs(v.x)<=Math.abs(playerRunSpeed)){
                v.x=this.node.scaleX*playerRunSpeed
                this.body.linearVelocity=v
            }
        }
    },


    
    run(flag){
        let v = this.body.linearVelocity
        if(flag){
            window.isRuning=true
            if(Math.abs(v.x)<=Math.abs(playerRunSpeed)||v.x*this.node.scaleX<0){
                v.x=this.node.scaleX*playerRunSpeed
                this.body.linearVelocity=v
            }else if(window.isDashing){
                v.x=this.node.scaleX*playerRunSpeed
                this.body.linearVelocity=v
            }
        }else if(!flag){
            v.x=0
            this.body.linearVelocity=v
            window.isRuning=false

        }
    },
    dash(flag){
        let v = this.body.linearVelocity
        if(flag){
            window.isDashing=true;
            v.x=this.node.scaleX*playerRunSpeed*2
            this.body.linearVelocity=v
        }else if(!flag&&window.isDashing){
            v.x=this.node.scaleX*playerRunSpeed*window.isRuning
            this.body.linearVelocity=v
            window.isDashing=false;
        }
    },

    changeState(state){
        if(window.isAttacking)window.isAttacking=false
        if(!this.attackEreased){
            this.offAttack(this.attackType)
        }
        if(state!="normalAttack")window.attackCount=0
        if(window.isHurting||(state!="normalAttack"&&state==window.state)){
            return;
        }else{
            window.state=state
        }
        var anim = this.node.getComponent(cc.Animation)
        if(state=="idle"){
            anim.play("idle")
        }else if(state=="run"){
            anim.play("run")
        }else if(state=="jumpUp"){
            anim.play("jumpUp")
        }else if(state=="jumpDown"){
            anim.play("jumpDown")
        }else if(state=="normalAttack"){
            anim.play("Attack-"+(window.attackCount%3+1))
        }else if(state=="runAttack"){
            anim.play("runAttack")
        }else if(state=="jumpAttack"){
            anim.play("jumpAttack")
        }else if(state=="dash"){
            anim.play("dash")
        }else if(state=="isWall"){
            anim.play("isWall")
        }else if(state=="dashAttack"){
            anim.play("dashAttack")
        }else if(state=="hurt"){
            anim.play("hurt")
        }else if(state=="death"){
            anim.play("death")
        }
    },

    fall(){
        this.changeState("jumpDown");
    },

    onKeyDown(event){
        var v=this.body.linearVelocity;
        switch(event.keyCode){
            case cc.macro.KEY.a:{
                
                    if((window.isWall&&this.node.scaleX==-1))return
                    this.node.scaleX=-1
                    if(window.isAttacking||window.isHurting)break
                    this.run(true)
                    if(window.isGround==false){
                        this.changeState("jumpDown")
                        break;
                    }
                    this.changeState("run")

                    break;
                
                
            }
            case cc.macro.KEY.d:{
                
                if((window.isWall&&this.node.scaleX==1))return
                this.node.scaleX=1
                if(window.isAttacking||window.isHurting)break
                    this.run(true)
                    if(window.isGround==false){
                        this.changeState("jumpDown")
                        break;
                    }
                    this.changeState("run")

                    break;
                
                
            }
            case cc.macro.KEY.k:{
                if(window.isHurting)return 
                window.isAttacking=false
                window.attackCount=0
                if(window.isGround==false&&window.isWall==false)break;
                console.log("跳跃")
                this.changeState("jumpUp")
                //cc.tween(this.node).by(0.3,{y:playerJumpHeight},{easing:"quadOut"}).start()
                v.y+=playerJumpSpeed;
                this.body.linearVelocity=v
                window.isWall=false
                break;

            }
            case cc.macro.KEY.j:{
                if(window.isHurting)return
                if(window.isWall)return
                if(window.isGround==true&&!window.isRuning&&!window.isDashing){
                    console.log("触发攻击");
                    window.attackFlag=true
                    if(window.attackCount==0)
                        this.normalAttack()
                }else if(window.isGround==true&&window.isDashing&&window.isAttacking==false){
                    console.log("冲刺攻击");
                    this.changeState("dashAttack")
                }else if(window.isGround==true&&window.isRuning&&window.isAttacking==false){
                    // let v = this.body.linearVelocity
                    // if(Math.abs(v.x)<(window.playerRunSpeed+200)){
                    //     v.x+=200*this.node.scaleX
                    //     this.body.linearVelocity=v
                    // }

                    console.log("奔跑攻击");
                    this.changeState("runAttack")
                }else if(window.isGround!=true){
                    console.log("跳跃攻击")
                    this.changeState("jumpAttack")
                }
                break;
            }
            case cc.macro.KEY.l:{
                if(window.dashCoolDown==0){
                    console.log("冲刺")
                    this.dash(true)
                    this.changeState("dash")
                    window.dashCoolDown=100
                }else console.log("冲刺cd中");
            }
            case cc.macro.KEY.h:{
                if(window.isHurting)return
                if(window.touchWall&&!window.isGround){
                    if(!window.isWall){
                        window.isWall=true
                        this.body.linearVelocity={x:0,y:0}
                        this.changeState("isWall")
                    }else{
                        window.isWall=false

                    }
                }
            }
        }

    },
    afterRunAttack(){
        if(window.isRuning){
            this.changeState("run")  
        }else{
            this.changeState("idle")
        }
    },
    afterDash(){
        if(!window.isGround){
            this.changeState("jumpDown")
            return
        }
        this.dash(false)
        if(!window.isRuning){
            this.body.linearVelocity.x=0
            this.changeState("idle")
        }else{
            this.changeState("run")
        }
    },
    normalAttack(){
        if(window.attackFlag){
            console.log("开始攻击，连击数："+window.attackCount);
            window.isAttacking=true
            this.changeState("normalAttack")
            window.attackCount++
            window.attackFlag=false
        }else{
            console.log("取消连击");
            window.attackCount=0
            window.isAttacking=false
            this.changeState("idle")
        }
    },
    onKeyUp(event){
        switch(event.keyCode){
            case cc.macro.KEY.a:{
                if(window.isAttacking||(window.isWall&&this.node.scaleX==-1)){
                    this.run(false)
                    break
                }
                if(window.isHurting)return
                window.isWall=false
                if(this.node.scaleX==1)break
                this.run(false)
                if(isGround==false)break
                this.changeState("idle")

                break;
            }
            case cc.macro.KEY.d:{
                if(window.isAttacking||(window.isWall&&this.node.scaleX==1)){
                    this.run(false)
                    break
                }
                if(window.isHurting)return
                window.isWall=false
                if(this.node.scaleX==-1)break
                this.run(false)
                if(isGround==false)break
                this.changeState("idle")

                break;
            }
        }

    },
    onBeginContact(contact, selfCollider, otherCollider) {
        this.dash(false)
        if(otherCollider.node.group=="ground"){
            
            if(!window.isRuning){
                this.changeState("idle")
            }else{
                this.changeState("run")
            }
            window.isGround=true;
        }else if(otherCollider.node.group=="wall"){
            console.log("接触墙壁");
            window.touchWall=true
        }else if(otherCollider.node.group=="enemy"&&!window.isHurting&&!otherCollider.node.death&&window.mutekiTime<=0){
            window.isWall=false
            window.isAttacking=false
            window.mutekiTime=1
            let v = this.body.linearVelocity
            v.x=-200*this.node.scaleX
            v.y=0
            this.body.linearVelocity=v
            window.hitPorints--
            this.hp.progress=window.hitPorints/10
            if(window.hitPorints==0){
                this.changeState("death")
                window.isHurting=true
            }else{
                this.changeState("hurt")
                window.isHurting=true
            }
            
            
        }
    },
    onEndContact(contact, selfCollider, otherCollider) {
        if(otherCollider.node.group=="ground"){
            if(this.body.linearVelocity.y<=0){
                this.fall()
            }
            window.isGround=false;
        }else if(otherCollider.node.group=="wall"){
            console.log("离开墙壁");
            window.touchWall=false
            window.isWall=false

        }
        
    },

    cameraMove(){
        this.map=cc.find("Canvas/map")
        let dis = Math.abs(this.node.x-this.cameraNode.x)
        if(dis<5){
            this.cameraSpeed=0
            return
        }
        if(this.cameraSpeed<=5){
            this.cameraSpeed+=0.5
        }
        if(this.cameraNode.x<=this.node.x&&!(Math.abs(this.map.width/2-this.cameraNode.width/2)<=Math.abs(this.cameraNode.x-this.map.x)&&(this.cameraNode.x-this.map.x)>0)){
            this.cameraNode.x+=this.cameraSpeed
        }
        if(this.cameraNode.x>=this.node.x&&!(Math.abs(this.map.width/2-this.cameraNode.width/2)<=Math.abs(this.cameraNode.x-this.map.x)&&(this.cameraNode.x-this.map.x)<0)){
            this.cameraNode.x-=this.cameraSpeed
        }
    },

    onAttack(type){
        this.attackType=type
        this.attackEreased=false;
        if(type=="normalAttack1"){
            let normalAttack1 = cc.instantiate(this.normalAttack1)
            this.node.addChild(normalAttack1);
            //normalAttack1.setPosition(this.body.x, this.body.y);
        }else if(type=="normalAttack2"){
            let normalAttack2 = cc.instantiate(this.normalAttack2)
            this.node.addChild(normalAttack2);
        }else if(type=="normalAttack3"){
            let normalAttack3 = cc.instantiate(this.normalAttack3)
            this.node.addChild(normalAttack3);
        }else if(type=="jumpAttack"){
            let jumpAttack = cc.instantiate(this.jumpAttack)
            this.node.addChild(jumpAttack);
        }else if(type=="runAttack"){
            let runAttack = cc.instantiate(this.runAttack)
            this.node.addChild(runAttack);
        }else if(type=="dashAttack"){
            let dashAttack = cc.instantiate(this.dashAttack)
            this.node.addChild(dashAttack);
        }
    },
    offAttack(type){
        this.attackEreased=true;
        if(type=="normalAttack1"){
            if(this.node.getChildByName("normalAttack1")!=null){
                this.node.getChildByName("normalAttack1").destroy()
            }
        }else if(type=="normalAttack2"){
            if(this.node.getChildByName("normalAttack2")!=null){
                this.node.getChildByName("normalAttack2").destroy()
            }
        }else if(type=="normalAttack3"){
            if(this.node.getChildByName("normalAttack3")!=null){
                this.node.getChildByName("normalAttack3").destroy()
            }
        }else if(type=="jumpAttack"){
            if(this.node.getChildByName("jumpAttack")!=null){
                this.node.getChildByName("jumpAttack").destroy()
            }

        }else if(type=="runAttack"){
            if(this.node.getChildByName("runAttack")!=null){
                this.node.getChildByName("runAttack").destroy()
            }
        }else if(type=="dashAttack"){
            if(this.node.getChildByName("dashAttack")!=null){
                this.node.getChildByName("dashAttack").destroy()
            }
        }
    },

    afterHurt(){
        window.isHurting=false
        let v= this.body.linearVelocity
        v.x=0
        this.body.linearVelocity=v
        this.changeState("idle")
    },

    die(){
        this.body.gravityScale=0
        let v = this.body.linearVelocity
        v.x=0
        v.y=0
        this.body.linearVelocity=v
        this.node.stopAllActions()
        this.node.getComponent(cc.PhysicsBoxCollider).destroy()
        cc.find("Canvas/UI Camera/GameOver").getComponent(cc.Animation).play("gameOver")
    }
});
