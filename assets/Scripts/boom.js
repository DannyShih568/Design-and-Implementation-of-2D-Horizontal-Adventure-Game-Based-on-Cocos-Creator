
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        this.rb=this.node.getComponent(cc.RigidBody);
        this.playerNode = cc.find('Canvas/player');
        this.bossNode = cc.find('Canvas/Boss');
        this.p_pos=this.playerNode.position
        this.b_pos=this.bossNode.position;
    },

    boomdestory(){
        this.node.removeFromParent();
       
    },

    start () {
        this.v = this.rb.linearVelocity
        this.x_distant=this.p_pos.x-this.b_pos.x;
        this.y_distant=this.p_pos.y-this.b_pos.y;
        this.rateX=this.x_distant/(this.y_distant+this.x_distant);
        this.rateY=this.y_distant/(this.y_distant+this.x_distant);
        //console.log(x_distant,y_distant);
        
            //v.y=100*y_distant/x_distant;
        // this.v.x+=-400*this.rateX*this.bossNode.scaleX
        // this.v.y+=400*this.rateY
        // this.rb.linearVelocity=this.v;
        
    },

    update (dt) {
        this.v.x+=this.x_distant*this.rateX/120
        this.v.y+=this.y_distant*this.rateY/120
        this.rb.linearVelocity=this.v;
    },

});


