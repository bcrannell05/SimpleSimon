var game={ // Starts out the game at level 1 and turn 0.
    level: 1,
    turn: 0,
    difficulty: 1,
    classic: 1,
    score: 0,
    active: false,
    handler: false,
    shape: ".shape",
    genSequence: [],
    plaSequence: [],
    init: function(){ //
        if(this.handler === false){
            this.initPadHandler();
        }
        this.newGame();
    },
    initPadHandler: function(){ //controls the pad flashing and the clicking of the pads
        that=this;
        $(".pad").on('click',function(){
            if(that.active===true){
                var pad=parseInt($(this).data('pad'),10);
                that.flash($(this),1,300, pad);
                that.logPlayerSequence(pad);
            }
        });
        this.handler=true;
    },
    newGame: function(){ //what the game displays when you start a new game
        this.level=1;
        this.score=0;
        this.newLevel();
        this.displayLevel();
        this.displayScore();
    },
    newLevel: function(){ // this function adds a new level and sequence if you get the sequence right
        this.plaSequence.length=0;
        this.pos=0;
        this.turn=0;
        this.active=true;
        if(this.classic !== 1){
            this.genSequence.length=0;
            this.randomizePad(this.level);
        }else if(this.classic ===1 && this.level ===1){
            this.genSequence.length=0;
            this.randomizePad(50);
        }
        if(this.classic ===1 && this.level > 50){
            this.level = 50;
        }
        this.displaySequence();
    },
    flash: function(element, times, speed, pad){ //this function animates the flashing of the pads
        if(times > 0){
            element.stop().animate({opacity: '1'}, {
                duration: 70,
                complete: function(){
                    element.stop().animate({opacity: '0.6'}, 200);
                }
            });
        }
        if (times > 0) {
            setTimeout(function () {
                that.flash(element, times, speed, pad);
            }, speed);
            times -= 1;
        }
    },
    randomizePad: function(passes){ // this function generates the randomness of which pads flash
        for(i = 0; i < passes; i++){
            this.genSequence.push(Math.floor(Math.random() * 4) + 1);
        }
    },
    logPlayerSequence: function(pad){ //this function logs the sequence that the player clicks
        this.plaSequence.push(pad);
        this.checkSequence();
    },
    checkSequence: function(pad){ //this function checks the logged sequence to make sure its correct
        if(this.plaSequence[this.turn] !== this.genSequence[this.turn]){
            this.incorrectSequence(pad);
        }else{
            this.keepScore();
            this.turn++;
        }
        if(this.turn === this.level){
            this.level++;
            this.displayLevel();
            this.active=false;
            setTimeout(function(){
                that.newLevel();
            },1000);
        }
    },
    displaySequence: function(){ //this function displays the sequence that needs to be copyied
        $.each(this.genSequence, function(index, val) {
            setTimeout(function(){
                that.flash($(that.shape+val),1,300,val);
            },500*index*that.difficulty);
            if(index === that.level-1){
                return false;
            }
        });
    },
    displayLevel: function(){ //this function displays the level you are on
        $('.level h2').text("Level: "+this.level);
    },
    displayScore: function(){ //this function displays the score
        $('.score h2').text("Score: "+this.score);
    },
    keepScore: function(){ // this function is what keeps your score. it gives your two points for every correct pad you click
        var multiplier=0;
        switch(this.difficulty)
        {
            case '1':
                multiplier=2;
                break;
        }
        this.score += (1 * multiplier);
        this.displayScore();
    },
    incorrectSequence: function(){ //this function is here if you dont get the sequence correct. the game will end and the pad you were suppose to click will blink and a sound will play.
        var doh = $('#doh')[0];
        var corPad = this.genSequence[this.turn],
            that = this;
        this.active=false;
        this.displayLevel();
        this.displayScore();
        setTimeout(function(){
            that.flash($(that.shape+corPad),4,300,corPad);
        },500);
        $('#doh').get(0).play();
        $(".start").show();
        $(".difficulty").show();
        $(".mode").show();
    }
};
$(document).ready(function(){ //this function hides the buttons once start is clicked.
    $(".start").on("mouseup", function(){
        $(this).hide();
        game.difficulty = $('input[name=difficulty]:checked').val();
        $(".difficulty").hide();
        game.classic = parseInt($('input[name=mode]:checked').val(),10);
        $(".mode").hide();
        game.init();
    });
});